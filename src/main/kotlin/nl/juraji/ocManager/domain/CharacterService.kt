package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.characters.CharacterRepository
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@Service
class CharacterService(
    private val characterRepository: CharacterRepository,
) {
    fun getAllCharacters(): Flux<OcCharacter> =
        characterRepository.findAll()

    fun getCharacterById(characterId: String): Mono<OcCharacter> =
        characterRepository
            .findById(characterId)
            .orElseEntityNotFound(OcCharacter::class, characterId)

    fun createCharacter(character: OcCharacter): Mono<OcCharacter> =
        characterRepository.save(character.copy(id = null))

    fun updateCharacter(characterId: String, character: OcCharacter) =
        getCharacterById(characterId)
            .map { character.copy(id = it.id, thumbnail = it.thumbnail) }
            .flatMap(characterRepository::save)

    fun deleteCharacter(characterId: String): Mono<Void> =
        characterRepository.deleteById(characterId)
}
