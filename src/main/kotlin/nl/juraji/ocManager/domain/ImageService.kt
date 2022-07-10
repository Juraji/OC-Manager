package nl.juraji.ocManager.domain

import nl.juraji.ocManager.configuration.OcManagerConfiguration
import nl.juraji.ocManager.configuration.requestPortfolioId
import nl.juraji.ocManager.domain.applicationEvents.OcEntityToBeDeletedEvent
import nl.juraji.ocManager.domain.images.ImageRepository
import nl.juraji.ocManager.domain.images.OcImage
import nl.juraji.ocManager.domain.portfolios.OcPortfolioToBeDeletedEvent
import nl.juraji.ocManager.util.LoggerCompanion
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.context.event.EventListener
import org.springframework.core.io.PathResource
import org.springframework.core.io.Resource
import org.springframework.http.MediaType
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers
import reactor.kotlin.core.publisher.toMono
import java.awt.Color
import java.awt.image.BufferedImage
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardOpenOption
import java.time.Instant
import java.util.*
import javax.imageio.ImageIO
import kotlin.io.path.inputStream
import kotlin.io.path.outputStream

@Service
class ImageService(
    private val imageRepository: ImageRepository,
    private val configuration: OcManagerConfiguration,
) {

    fun getImageById(imageId: String): Mono<OcImage> =
        imageRepository
            .findById(imageId)
            .orElseEntityNotFound(OcImage::class, imageId)

    fun getImageThumbnailResourceById(imageId: String): Mono<Resource> =
        getImageById(imageId)
            .map(OcImage::thumbnailPath)
            .map(::PathResource)

    fun getImageSourceResourceById(imageId: String): Mono<Resource> =
        getImageById(imageId)
            .map(OcImage::sourcePath)
            .map(::PathResource)

    @Transactional
    fun saveImage(file: Mono<FilePart>, linkToNodeId: String): Mono<OcImage> {
        fun getExtensionFor(mt: MediaType?): String = when (mt?.subtype) {
            "jpeg" -> "jpg"
            "png" -> "png"
            "gif" -> "gif"
            "tiff" -> "tiff"
            else -> "jpg"
        }

        fun getImgPath(baseName: String, ext: String): Path =
            configuration.getDataDir("images").resolve("${baseName}.${ext}")

        return file
            .flatMap { fp ->
                val sourceName = fp.filename()
                val sourceExt = getExtensionFor(fp.headers().contentType)
                val sourceFileSize = fp.headers().contentLength
                val uploadedOn = Instant.now()

                val imageId = UUID.randomUUID().toString()
                val thumbnailPath = getImgPath("${imageId}_thumbnail", configuration.thumbnailType)
                val sourcePath = getImgPath("${imageId}_source", sourceExt)

                fp.transferTo(sourcePath)
                    .then(createThumbnail(sourcePath, thumbnailPath))
                    .map {
                        OcImage(
                            id = imageId,
                            sourceName = sourceName,
                            sourceFileSize = sourceFileSize,
                            uploadedOn = uploadedOn,
                            thumbnailPath = thumbnailPath,
                            sourcePath = sourcePath
                        )
                    }
            }
            .flatMap { imageRepository.save(it) }
            .transformDeferredContextual { imgMono, ctx ->
                imgMono.flatMap {
                    linkImageToNodeAndPortfolio(it, linkToNodeId, ctx.requestPortfolioId)
                }
            }
    }

    fun deleteImage(imageId: String): Mono<Void> =
        getImageById(imageId)
            .publishOn(Schedulers.boundedElastic())
            .map {
                Files.deleteIfExists(it.thumbnailPath)
                Files.deleteIfExists(it.sourcePath)
                it.id
            }
            .flatMap(imageRepository::deleteById)

    fun getSingleImageByLinkedNodeId(linkedNodeId: String): Mono<OcImage> =
        getImagesByLinkedNodeId(linkedNodeId)
            .take(1).toMono()
            .orElseEntityNotFound(OcImage::class, linkedNodeId)

    fun getImagesByLinkedNodeId(linkedNodeId: String): Flux<OcImage> =
        imageRepository.findByLinkedNodeId(linkedNodeId)

    @EventListener
    fun onOcEntityToBeDeletedEvent(e: OcEntityToBeDeletedEvent) =
        getImagesByLinkedNodeId(e.entityId)
            .flatMap { deleteImage(it.id) }
            .onErrorContinue { t, _ ->logger.error("Failed deleting image for entity with id ${e.entityId}", t)}
            .blockLast()

    @EventListener
    fun onOcPortfolioToBeDeletedEvent(e: OcPortfolioToBeDeletedEvent) =
        imageRepository
            .findByPortfolioId(e.entityId)
            .flatMap { deleteImage(it.id) }
            .onErrorContinue { t, _ -> logger.error("Failed deleting image for portfolio with id ${e.entityId}", t) }
            .blockLast()

    private fun linkImageToNodeAndPortfolio(image: OcImage, linkToNodeId: String, portfolioId: String) =
        imageRepository.run {
            linkImageToPortfolioById(image.id, portfolioId)
                .then(linkImageToNodeById(image.id, linkToNodeId))
        }

    private fun createThumbnail(sourcePath: Path, thumbnailPath: Path): Mono<Boolean> {
        @Suppress("BlockingMethodInNonBlockingContext")
        fun createThumbNail(): BufferedImage {
            val originalImage = ImageIO.read(sourcePath.inputStream(StandardOpenOption.READ))

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

            return BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB).apply {
                createGraphics().apply {
                    background = Color.WHITE
                    clearRect(0, 0, targetWidth, targetHeight)
                    drawImage(originalImage, 0, 0, targetWidth, targetHeight, null)
                    dispose()
                }
            }
        }

        fun writeFile(image: BufferedImage): Boolean =
            thumbnailPath.outputStream()
                .use { ImageIO.write(image, configuration.thumbnailType, it) }

        return Mono.just(thumbnailPath)
            .publishOn(Schedulers.boundedElastic())
            .map { createThumbNail() }
            .map { image -> writeFile(image) }
    }

    companion object : LoggerCompanion(ImageService::class)
}
