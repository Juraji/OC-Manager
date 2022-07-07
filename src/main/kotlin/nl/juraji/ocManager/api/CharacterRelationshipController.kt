package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.CharacterRelationshipService
import nl.juraji.ocManager.domain.characters.OcCharacterRelationship
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("/api/characters/{characterId}/relationships")
class CharacterRelationshipController(
    private val relationshipService: CharacterRelationshipService
) {

    @GetMapping
    fun getAllByCharacterId(
        @PathVariable characterId: String
    ): Flux<OcCharacterRelationship> = relationshipService.getAllByCharacterId(characterId)

    @PostMapping
    fun createRelationship(
        @PathVariable characterId: String,
        @Valid @RequestBody relationship: OcCharacterRelationship,
    ): Mono<OcCharacterRelationship> = relationshipService
        .createRelationship(relationship)

    @DeleteMapping("/{relationshipId}")
    fun deleteRelationship(
        @PathVariable characterId: String,
        @PathVariable relationshipId: String
    ): Mono<Void> = relationshipService.deleteRelationship(relationshipId)
}
