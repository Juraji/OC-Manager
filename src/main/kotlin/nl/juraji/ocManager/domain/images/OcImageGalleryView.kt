package nl.juraji.ocManager.domain.images

import java.time.Instant

data class OcImageGalleryView(
    override val id: String,
    override val sourceName: String,
    override val sourceFileSize: Long,
    override val uploadedOn: Instant,
    val parentNodeId: String,
    val parentNodeLabels: List<String>,
) : BaseOcImage
