package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import javax.validation.constraints.NotBlank

data class OcCustomTrait(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    override val id: String? = null,
    @NotBlank
    val label: String,
    @NotBlank
    val description: String,
) : OcCharacterTrait
