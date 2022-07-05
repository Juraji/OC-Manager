package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.traits.CharacterTraitRepository
import nl.juraji.ocManager.domain.traits.OcCharacterTrait
import nl.juraji.ocManager.domain.traits.TraitCharactersRepository
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class CharacterTraitService(
    private val characterTraitRepository: CharacterTraitRepository,
    private val traitCharactersRepository: TraitCharactersRepository,
) {
    fun getAllCharacterTraits(): Flux<OcCharacterTrait> =
        characterTraitRepository.findAll()

    fun getCharacterTraitsById(traitId: String): Mono<OcCharacterTrait> =
        characterTraitRepository
            .findById(traitId)
            .orElseEntityNotFound(OcCharacterTrait::class, traitId)

    fun createCharacterTrait(trait: OcCharacterTrait): Mono<OcCharacterTrait> =
        characterTraitRepository.save(trait)

    fun updateCharacterTrait(traitId: String, trait: OcCharacterTrait): Mono<OcCharacterTrait> =
        getCharacterTraitsById(traitId)
            // TODO: Should copy trait to db entity, protecting id (no data class copy on interface?)
            .flatMap { characterTraitRepository.save(trait) }

    fun deleteCharacterTrait(traitId: String): Mono<Void> =
        characterTraitRepository.deleteById(traitId)

    fun getAllCharacterTraits(characterId: String): Flux<OcCharacterTrait> =
        characterTraitRepository.findAllByCharacterId(characterId)

    fun addTraitToCharacter(characterId: String, traitId: String): Mono<OcCharacterTrait> =
        characterTraitRepository
            .addTraitToCharacter(characterId, traitId)
            .orElseEntityNotFound(OcCharacterTrait::class, traitId)

    fun removeTraitFromCharacter(characterId: String, traitId: String): Mono<Void> =
        characterTraitRepository.removeTraitFromCharacter(characterId, traitId)

    fun getCharactersWithTrait(traitId: String): Flux<OcCharacter> =
        traitCharactersRepository.findAllCharactersWithTrait(traitId)
}
