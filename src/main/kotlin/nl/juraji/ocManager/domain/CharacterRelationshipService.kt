package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.characters.CharacterRelationshipRepository
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.characters.OcCharacterRelationship
import nl.juraji.ocManager.util.orElseRelationshipNotCreated
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class CharacterRelationshipService(
    private val characterRelationshipRepository: CharacterRelationshipRepository
) {
    fun getAllByCharacterId(characterId: String): Flux<OcCharacterRelationship> =
        characterRelationshipRepository.findAllByCharacterId(characterId)

    fun createRelationship(relationship: OcCharacterRelationship): Mono<OcCharacterRelationship> =
        characterRelationshipRepository
            .create(relationship)
            .orElseRelationshipNotCreated(
                OcCharacter::class,
                OcCharacter::class,
                relationship.sourceCharacterId,
                relationship.targetCharacterId
            )

    fun deleteRelationship(relationshipId: String): Mono<Void> =
        characterRelationshipRepository.deleteById(relationshipId)
}
