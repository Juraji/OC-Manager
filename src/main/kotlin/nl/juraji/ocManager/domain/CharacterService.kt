package nl.juraji.ocManager.domain

import nl.juraji.ocManager.configuration.requestPortfolioId
import nl.juraji.ocManager.domain.characters.CharacterRepository
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import nl.juraji.ocManager.util.flatMapContextual
import nl.juraji.ocManager.util.orElseEntityNotFound
import nl.juraji.ocManager.util.orElseRelationshipNotCreated
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@Service
class CharacterService(
    private val characterRepository: CharacterRepository,
) {
    fun getAllCharacters(): Flux<OcCharacter> = Flux
        .deferContextual { characterRepository.findAllCharactersByPortfolioId(it.requestPortfolioId) }

    fun getCharacterById(characterId: String): Mono<OcCharacter> =
        characterRepository
            .findById(characterId)
            .orElseEntityNotFound(OcCharacter::class, characterId)

    @Transactional
    fun createCharacter(character: OcCharacter): Mono<OcCharacter> =
        characterRepository
            .save(character.copy(id = null))
            .flatMapContextual { addCharacterToPortfolio(requestPortfolioId, it) }

    fun updateCharacter(characterId: String, character: OcCharacter) =
        getCharacterById(characterId)
            .map { character.copy(id = it.id, thumbnail = it.thumbnail) }
            .flatMap(characterRepository::save)

    fun deleteCharacter(characterId: String): Mono<Void> =
        characterRepository.deleteById(characterId)

    private fun addCharacterToPortfolio(requestPortfolioId: String, character: OcCharacter): Mono<OcCharacter> =
        characterRepository
            .addCharacterToPortfolio(requestPortfolioId, character.id!!)
            .orElseRelationshipNotCreated(OcPortfolio::class, OcCharacter::class, requestPortfolioId, character.id)
}
