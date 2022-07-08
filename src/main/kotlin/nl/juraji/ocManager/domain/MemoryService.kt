package nl.juraji.ocManager.domain

import nl.juraji.ocManager.configuration.requestPortfolioId
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.memories.MemoryCharactersRepository
import nl.juraji.ocManager.domain.memories.MemoryRepository
import nl.juraji.ocManager.domain.memories.OcMemory
import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import nl.juraji.ocManager.util.flatMapContextual
import nl.juraji.ocManager.util.orElseEntityNotFound
import nl.juraji.ocManager.util.orElseRelationshipNotCreated
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class MemoryService(
    private val memoryRepository: MemoryRepository,
    private val memoryCharactersRepository: MemoryCharactersRepository,
) {

    fun getAllMemories(): Flux<OcMemory> = Flux
        .deferContextual { memoryRepository.findAllByPortfolioId(it.requestPortfolioId) }

    fun getMemoryById(memoryId: String): Mono<OcMemory> = Mono
        .deferContextual { memoryRepository.findByPortfolioIdAndId(it.requestPortfolioId, memoryId) }
        .orElseEntityNotFound(OcMemory::class, memoryId)

    fun createMemory(memory: OcMemory): Mono<OcMemory> =
        memoryRepository
            .save(memory.copy(id = null))
            .flatMapContextual { addMemoryToPortfolio(requestPortfolioId, it) }

    fun updateMemory(memoryId: String, memory: OcMemory): Mono<OcMemory> =
        getMemoryById(memoryId)
            .map { memory.copy(id = it.id) }
            .flatMap(memoryRepository::save)

    fun deleteMemory(memoryId: String): Mono<Void> =
        memoryRepository.deleteById(memoryId)

    fun getAllByCharacterId(characterId: String): Flux<OcMemory> =
        memoryRepository.findAllByCharacterId(characterId)

    fun getMemoryCharacters(memoryId: String): Flux<OcCharacter> =
        memoryCharactersRepository.findMemoryCharacters(memoryId)

    fun addCharacterToMemory(memoryId: String, characterId: String): Mono<OcCharacter> =
        memoryCharactersRepository
            .addCharacterToMemory(memoryId, characterId)
            .orElseRelationshipNotCreated(OcMemory::class, memoryId, OcCharacter::class, characterId)

    fun removeCharacterFromMemory(memoryId: String, characterId: String): Mono<Void> =
        memoryCharactersRepository
            .removeCharacterFromMemory(memoryId, characterId)

    private fun addMemoryToPortfolio(portfolioId: String, memory: OcMemory): Mono<OcMemory> =
        memoryRepository
            .addMemoryToPortfolio(portfolioId, memory.id!!)
            .orElseRelationshipNotCreated(OcPortfolio::class, portfolioId, OcMemory::class, memory.id)
}
