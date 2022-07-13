package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.ImageService
import nl.juraji.ocManager.domain.images.OcImage
import nl.juraji.ocManager.domain.images.OcImageGalleryView
import org.springframework.core.io.Resource
import org.springframework.http.MediaType
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@RestController
@RequestMapping("/api/images")
class ImageController(
    private val imageService: ImageService,
) {

    @GetMapping
    fun getImagesByLinkedNodeId(
        @RequestParam linkedNodeId: String
    ): Flux<OcImage> =
        imageService.getImagesByLinkedNodeId(linkedNodeId)

    @GetMapping("/gallery")
    fun getAllImagesAsGalleryViews(): Flux<OcImageGalleryView> =
        imageService.getAllImagesAsGalleryViews()

    @GetMapping("/{imageId}/thumbnail")
    fun getImageThumbnailResourceById(
        @PathVariable imageId: String
    ): Mono<Resource> =
        imageService.getImageThumbnailResourceById(imageId)

    @GetMapping("/{imageId}/source")
    fun getImageSourceResourceById(
        @PathVariable imageId: String
    ): Mono<Resource> =
        imageService.getImageSourceResourceById(imageId)

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun saveImage(
        @RequestPart("file") file: Mono<FilePart>,
        @RequestParam linkToNodeId: String
    ): Mono<OcImage> =
        imageService.saveImage(file, linkToNodeId)

    @DeleteMapping("/{imageId}")
    fun deleteImage(
        @PathVariable imageId: String
    ): Mono<Void> =
        imageService.deleteImage(imageId)
}
