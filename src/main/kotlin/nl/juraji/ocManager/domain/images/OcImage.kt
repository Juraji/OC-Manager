package nl.juraji.ocManager.domain.images

import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Id
import org.springframework.data.neo4j.core.schema.Node
import java.nio.file.Path

@Node
data class OcImage(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    val id: String,
    val thumbnailPath: Path,
    val sourcePath: Path,
)