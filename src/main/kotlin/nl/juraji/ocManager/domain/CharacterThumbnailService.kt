package nl.juraji.ocManager.domain

import nl.juraji.ocManager.configuration.OcManagerConfiguration
import nl.juraji.ocManager.domain.characters.CharacterRepository
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.PathResource
import org.springframework.core.io.Resource
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers
import reactor.kotlin.core.util.function.component1
import reactor.kotlin.core.util.function.component2
import java.awt.Color
import java.awt.image.BufferedImage
import java.nio.file.Path
import javax.imageio.ImageIO
import kotlin.io.path.outputStream

@Service
class CharacterThumbnailService(
    private val characterRepository: CharacterRepository,
    private val configuration: OcManagerConfiguration,
) {

    fun getCharacterThumbnail(characterId: String): Mono<Resource> =
        characterRepository
            .findById(characterId)
            .orElseEntityNotFound(OcCharacter::class, characterId)
            .mapNotNull<Path>(OcCharacter::thumbnail)
            .map(::PathResource)

    fun createCharacterThumbnail(characterId: String, thumbnailFilePart: Mono<FilePart>): Mono<OcCharacter> {
        val thumbnailPath = thumbnailFilePart
            .flatMap { fp ->
                DataBufferUtils
                    .join(fp.content())
                    .publishOn(Schedulers.boundedElastic())
                    .map { dataBuffer -> createThumbNailFromDataBuffer(characterId, dataBuffer) }
            }

        return characterRepository
            .findById(characterId)
            .orElseEntityNotFound(OcCharacter::class, characterId)
            .zipWith(thumbnailPath)
            .map { (character, path) -> character.copy(thumbnail = path) }
            .flatMap(characterRepository::save)
    }

    private fun createThumbNailFromDataBuffer(characterId: String, dataBuffer: DataBuffer): Path {
        val targetPath = configuration.thumbnailDir.resolve("${characterId}.$THUMBNAIL_EXT")
        val originalImage = ImageIO.read(dataBuffer.asInputStream())

        val boundedSize = configuration.thumbnailSize
        val originalWidth = originalImage.width
        val originalHeight = originalImage.height
        var targetWidth = originalWidth
        var targetHeight = originalHeight

        if (originalWidth > boundedSize) {
            targetWidth = boundedSize
            targetHeight = (targetWidth * originalHeight) / originalWidth
        }

        if (targetHeight > boundedSize) {
            targetHeight = boundedSize
            targetWidth = (targetHeight * originalWidth) / originalHeight
        }

        val thumbnailImage = BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB)
        val g2 = thumbnailImage.createGraphics()
        g2.background = Color.WHITE

        g2.clearRect(0, 0, targetWidth, targetHeight)
        g2.drawImage(originalImage, 0, 0, boundedSize, boundedSize, null)
        g2.dispose()

        targetPath.outputStream().use {
            ImageIO.write(thumbnailImage, THUMBNAIL_EXT, it)
        }

        return targetPath
    }

    companion object {
        private const val THUMBNAIL_EXT = "jpg"
    }
}
