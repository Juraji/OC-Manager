package nl.juraji.ocManager.domain.events

import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node
import java.time.Instant
import javax.validation.constraints.NotBlank

@Node
data class OcEvent(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    val id: String? = null,
    val date: Instant,
    @NotBlank
    val description: String,
)
