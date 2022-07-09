package nl.juraji.ocManager.domain

import nl.juraji.ocManager.configuration.requestPortfolioId
import nl.juraji.ocManager.domain.characters.CharacterRepository
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.characters.OcCharacterToBeDeletedEvent
import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import nl.juraji.ocManager.domain.portfolios.OcPortfolioToBeDeletedEvent
import nl.juraji.ocManager.util.LoggerCompanion
import nl.juraji.ocManager.util.flatMapContextual
import nl.juraji.ocManager.util.orElseEntityNotFound
import nl.juraji.ocManager.util.orElseRelationshipNotCreated
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@Service
class CharacterService(
    private val characterRepository: CharacterRepository,
    private val eventPublisher: ApplicationEventPublisher,
) {
    fun getAllCharacters(): Flux<OcCharacter> = Flux
        .deferContextual { characterRepository.findAllByPortfolioId(it.requestPortfolioId) }

    fun getCharacterById(characterId: String): Mono<OcCharacter> = Mono
        .deferContextual { characterRepository.findPortfolioIdAndById(it.requestPortfolioId, characterId) }
        .orElseEntityNotFound(OcCharacter::class, characterId)

    @Transactional
    fun createCharacter(character: OcCharacter): Mono<OcCharacter> =
        characterRepository
            .save(character.copy(id = null))
            .flatMapContextual { addCharacterToPortfolio(requestPortfolioId, it) }

    fun updateCharacter(characterId: String, character: OcCharacter) =
        getCharacterById(characterId)
            .map { character.copy(id = it.id) }
            .flatMap(characterRepository::save)

    @Transactional
    fun deleteCharacter(characterId: String): Mono<Void> = Mono.just(characterId)
        .doOnNext { eventPublisher.publishEvent(OcCharacterToBeDeletedEvent(it)) }
        .flatMap(characterRepository::deleteById)

    @EventListener
    fun onOcPortfolioToBeDeletedEvent(e: OcPortfolioToBeDeletedEvent) =
        characterRepository
            .findAllByPortfolioId(e.entityId)
            .flatMap { deleteCharacter(it.id!!) }
            .onErrorContinue { t, _ -> logger.error("Failed deleting a character for portfolio", t) }
            .blockLast()

    private fun addCharacterToPortfolio(requestPortfolioId: String, character: OcCharacter): Mono<OcCharacter> =
        characterRepository
            .addCharacterToPortfolio(requestPortfolioId, character.id!!)
            .orElseRelationshipNotCreated(OcPortfolio::class, requestPortfolioId, OcCharacter::class, character.id)

    companion object : LoggerCompanion(CharacterService::class)
}
