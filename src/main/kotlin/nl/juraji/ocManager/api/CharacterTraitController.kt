package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.CharacterTraitService
import nl.juraji.ocManager.domain.traits.OcCharacterTrait
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/characters/{characterId}/traits")
class CharacterTraitController(
    private val characterTraitService: CharacterTraitService,
) {

    @GetMapping
    fun getAllCharacterTraits(
        @PathVariable characterId: String
    ): Flux<OcCharacterTrait> = characterTraitService.getAllCharacterTraits(characterId)

    @PostMapping("/{traitId}")
    fun addTraitToCharacter(
        @PathVariable characterId: String,
        @PathVariable traitId: String
    ): Mono<OcCharacterTrait> = characterTraitService.addTraitToCharacter(characterId, traitId)

    @DeleteMapping("/{traitId}")
    fun removeTraitFromCharacter(
        @PathVariable characterId: String,
        @PathVariable traitId: String
    ): Mono<Void> = characterTraitService.removeTraitFromCharacter(characterId, traitId)
}
