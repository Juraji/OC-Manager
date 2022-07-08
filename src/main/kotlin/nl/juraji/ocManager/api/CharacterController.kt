package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.CharacterService
import nl.juraji.ocManager.domain.CharacterThumbnailService
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.images.OcImage
import org.springframework.core.io.Resource
import org.springframework.http.MediaType
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("/api/characters")
class CharacterController(
    private val characterService: CharacterService,
    private val thumbnailService: CharacterThumbnailService,
) {
    @GetMapping
    fun getAllCharacters(): Flux<OcCharacter> = characterService
        .getAllCharacters()

    @GetMapping("/{characterId}")
    fun getCharacterById(
        @PathVariable characterId: String
    ): Mono<OcCharacter> = characterService.getCharacterById(characterId)

    @PostMapping
    fun createCharacter(
        @Valid @RequestBody character: OcCharacter
    ): Mono<OcCharacter> = characterService.createCharacter(character)

    @PutMapping("/{characterId}")
    fun updateCharacter(
        @PathVariable characterId: String,
        @Valid @RequestBody character: OcCharacter
    ) = characterService.updateCharacter(characterId, character)

    @DeleteMapping("/{characterId}")
    fun deleteCharacter(
        @PathVariable characterId: String
    ) = characterService.deleteCharacter(characterId)

    @GetMapping("/{characterId}/thumbnail")
    fun getCharacterThumbnail(
        @PathVariable characterId: String
    ): Mono<Resource> = thumbnailService.getCharacterThumbnail(characterId)

    @PostMapping(
        path = ["/{characterId}/thumbnail"],
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE]
    )
    fun createCharacterThumbnail(
        @PathVariable characterId: String,
        @RequestPart("thumbnail") thumbnailFile: Mono<FilePart>
    ): Mono<OcImage> = thumbnailService.createCharacterThumbnail(characterId, thumbnailFile)
}
