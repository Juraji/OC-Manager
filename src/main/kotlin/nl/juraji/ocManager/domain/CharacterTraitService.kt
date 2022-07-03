package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.traits.CharacterTraitRepository
import nl.juraji.ocManager.domain.traits.OcCharacterTrait
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class CharacterTraitService(
    private val characterTraitRepository: CharacterTraitRepository,
) {
    fun getAllCharacterTraits(characterId: String): Flux<OcCharacterTrait> =
        characterTraitRepository.findAllByCharacterId(characterId)

    fun addTraitToCharacter(characterId: String, traitId: String): Mono<OcCharacterTrait> =
        characterTraitRepository
            .addTraitToCharacter(characterId, traitId)
            .orElseEntityNotFound(OcCharacterTrait::class, traitId)

    fun removeTraitFromCharacter(characterId: String, traitId: String): Mono<Void> =
        characterTraitRepository.removeTraitFromCharacter(characterId, traitId)
}