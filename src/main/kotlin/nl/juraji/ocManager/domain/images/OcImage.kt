package nl.juraji.ocManager.domain.images

import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.data.neo4j.core.schema.Id
import org.springframework.data.neo4j.core.schema.Node
import java.nio.file.Path
import java.time.Instant

interface BaseOcImage {
    val id: String
    val sourceName: String
    val sourceFileSize: Long
    val uploadedOn: Instant
}

@Node
data class OcImage(
    @Id
    override val id: String,
    override val sourceName: String,
    override val sourceFileSize: Long,
    override val uploadedOn: Instant,

    @JsonIgnore
    val thumbnailPath: Path,
    @JsonIgnore
    val sourcePath: Path,
): BaseOcImage
