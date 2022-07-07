package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.MemoryService
import nl.juraji.ocManager.domain.memories.OcMemory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux

@RestController
@RequestMapping("/api/characters/{characterId}/memories")
class CharacterMemoriesController(
    private val memoryService: MemoryService
) {

    @GetMapping
    fun getAllByCharacterId(
        @PathVariable characterId: String
    ): Flux<OcMemory> = memoryService.getAllByCharacterId(characterId)
}
