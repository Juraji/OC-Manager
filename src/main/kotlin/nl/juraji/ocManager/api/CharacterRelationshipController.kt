package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.CharacterRelationshipService
import nl.juraji.ocManager.domain.characters.OcCharacterRelationship
import nl.juraji.ocManager.domain.characters.OcCharacterRelationshipType
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/characters/{characterId}/relationships")
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
        @RequestParam targetCharacterId: String,
        @RequestParam type: OcCharacterRelationshipType,
        @RequestParam(required = false, defaultValue = "") description: String
    ): Mono<OcCharacterRelationship> = relationshipService
        .createRelationship(characterId, targetCharacterId, type, description)

    @PutMapping("/{relationshipId}")
    fun updateRelationship(
        @PathVariable characterId: String,
        @PathVariable relationshipId: String,
        @RequestParam(required = false) type: OcCharacterRelationshipType?,
        @RequestParam(required = false) description: String?
    ): Mono<OcCharacterRelationship> = relationshipService
        .updateRelationship(relationshipId, type, description)

    @DeleteMapping("/{relationshipId}")
    fun deleteRelationship(
        @PathVariable characterId: String,
        @PathVariable relationshipId: String
    ): Mono<Void> = relationshipService.deleteRelationship(relationshipId)
}
