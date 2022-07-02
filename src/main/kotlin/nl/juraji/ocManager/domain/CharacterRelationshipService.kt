package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.characters.CharacterRelationshipRepository
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.characters.OcCharacterRelationship
import nl.juraji.ocManager.domain.characters.OcCharacterRelationshipType
import nl.juraji.ocManager.util.orElseEntityNotFound
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

    fun getById(relationshipId: String): Mono<OcCharacterRelationship> =
        characterRelationshipRepository
            .findById(relationshipId)
            .orElseEntityNotFound(OcCharacterRelationship::class, relationshipId)

    fun createRelationship(
        sourceCharacterId: String,
        targetCharacterId: String,
        type: OcCharacterRelationshipType,
        description: String
    ): Mono<OcCharacterRelationship> =
        characterRelationshipRepository
            .create(sourceCharacterId, targetCharacterId, type, description)
            .orElseRelationshipNotCreated(OcCharacter::class, OcCharacter::class, sourceCharacterId, targetCharacterId)

    fun updateRelationship(
        relationshipId: String,
        type: OcCharacterRelationshipType? = null,
        description: String? = null
    ): Mono<OcCharacterRelationship> =
        getById(relationshipId)
            .flatMap {
                characterRelationshipRepository.updateById(
                    relationshipId = relationshipId,
                    type = type ?: it.type,
                    description = description ?: it.description
                )
            }

    fun deleteRelationship(relationshipId: String): Mono<Void> =
        characterRelationshipRepository.deleteById(relationshipId)
}
