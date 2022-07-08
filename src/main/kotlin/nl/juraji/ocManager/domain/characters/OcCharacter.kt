package nl.juraji.ocManager.domain.characters

import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node
import java.time.Instant
import javax.validation.constraints.NotBlank

@Node
data class OcCharacter(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    val id: String? = null,
    @NotBlank
    val name: String,
    val nickname: String,
    val dateOfBirth: Instant,
    val notes: String,
)
