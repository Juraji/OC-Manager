package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.characters.CharacterRepository
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.images.OcImage
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.core.io.Resource
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono

@Service
class CharacterThumbnailService(
    private val characterRepository: CharacterRepository,
    private val imageService: ImageService,
) {

    fun getCharacterThumbnail(characterId: String): Mono<Resource> =
        imageService
            .getImagesByLinkedNodeId(characterId)
            .toMono()
            .orElseEntityNotFound(OcImage::class, characterId)
            .flatMap { imageService.getImageThumbnailResourceById(it.id) }

    fun createCharacterThumbnail(characterId: String, thumbnailFilePart: Mono<FilePart>): Mono<OcImage> {
        return characterRepository
            .findById(characterId)
            .orElseEntityNotFound(OcCharacter::class, characterId)
            .flatMap { imageService.saveImage(thumbnailFilePart, characterId) }
    }
}
