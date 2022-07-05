package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Id
import org.springframework.data.neo4j.core.schema.Node
import javax.validation.constraints.NotBlank

@Node
data class OcSexuality(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    override val id: String?,
    @NotBlank
    val description: String,
) : OcCharacterTrait
