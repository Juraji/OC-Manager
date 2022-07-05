package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.CharacterTraitService
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.traits.OcCharacterTrait
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("/traits")
class TraitController(
    private val traitService: CharacterTraitService,
) {
    @GetMapping
    fun getAllCharacterTraits(): Flux<OcCharacterTrait> = traitService.getAllCharacterTraits()

    @GetMapping("/{traitId}")
    fun getCharacterTraitsById(
        @PathVariable traitId: String
    ): Mono<OcCharacterTrait> = traitService.getCharacterTraitsById(traitId)

    @PostMapping
    fun createCharacterTrait(
        @Valid @RequestBody trait: OcCharacterTrait
    ): Mono<OcCharacterTrait> = traitService.createCharacterTrait(trait)

    @PutMapping("/{traitId}")
    fun updateCharacterTrait(
        @PathVariable traitId: String,
        @Valid @RequestBody trait: OcCharacterTrait
    ): Mono<OcCharacterTrait> = traitService.updateCharacterTrait(traitId, trait)

    @DeleteMapping("/{traitId}")
    fun deleteCharacterTrait(
        @PathVariable traitId: String
    ): Mono<Void> = traitService.deleteCharacterTrait(traitId)

    @GetMapping("/{traitId}/characters")
    fun getCharactersWithTrait(
        @PathVariable traitId: String
    ): Flux<OcCharacter> = traitService.getCharactersWithTrait(traitId)
}
