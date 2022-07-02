package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node
import javax.validation.constraints.NotBlank

@Node("OcGenderPreference", "OcCharacterTrait")
data class OcGenderPreference(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    override val id: String? = null,
    @NotBlank
    val label: String,
): OcCharacterTrait
