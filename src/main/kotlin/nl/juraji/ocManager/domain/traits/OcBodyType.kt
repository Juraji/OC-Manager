package nl.juraji.ocManager.domain.traits

import com.fasterxml.jackson.annotation.JsonTypeInfo
import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node
import javax.validation.constraints.NotBlank

@Node("OcBodyType", "OcCharacterTrait")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY)
data class OcBodyType(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    override val id: String? = null,
    @NotBlank
    val label: String,
) : OcCharacterTrait
