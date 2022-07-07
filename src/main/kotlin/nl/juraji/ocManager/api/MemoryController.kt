package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.MemoryService
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.memories.OcMemory
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("/api/memories")
class MemoryController(
    private val memoryService: MemoryService,
) {
    @GetMapping
    fun getAllMemories() = memoryService.getAllMemories()

    @GetMapping("/{memoryId}")
    fun getMemoryById(
        @PathVariable memoryId: String
    ): Mono<OcMemory> = memoryService.getMemoryById(memoryId)

    @PostMapping
    fun createMemory(
        @Valid @RequestBody memory: OcMemory
    ): Mono<OcMemory> = memoryService.createMemory(memory)

    @PutMapping("/{memoryId}")
    fun updateMemory(
        @PathVariable memoryId: String,
        @Valid @RequestBody memory: OcMemory
    ): Mono<OcMemory> = memoryService.updateMemory(memoryId, memory)

    @DeleteMapping("/{memoryId}")
    fun deleteMemory(
        @PathVariable memoryId: String
    ): Mono<Void> = memoryService.deleteMemory(memoryId)

    @GetMapping("/{memoryId}/characters")
    fun getMemoryCharacters(
        @PathVariable memoryId: String
    ): Flux<OcCharacter> = memoryService.getMemoryCharacters(memoryId)

    @PostMapping("/{memoryId}/characters/{characterId}")
    fun addCharacterToMemory(
        @PathVariable memoryId: String,
        @PathVariable characterId: String,
    ): Mono<OcCharacter> = memoryService.addCharacterToMemory(memoryId, characterId)

    @DeleteMapping("/{memoryId}/characters/{characterId}")
    fun removeCharacterFromMemory(
        @PathVariable memoryId: String,
        @PathVariable characterId: String,
    ): Mono<Void> = memoryService.removeCharacterFromMemory(memoryId, characterId)
}
