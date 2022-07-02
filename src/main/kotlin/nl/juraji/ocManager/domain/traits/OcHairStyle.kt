package nl.juraji.ocManager.domain.traits

import com.fasterxml.jackson.annotation.JsonTypeInfo
import nl.convect.cbnbackend.util.validators.RequiredIfFieldValue
import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node

@Node("OcHairStyle", "OcCharacterTrait")
@RequiredIfFieldValue(
    sourceFieldName = "dyed",
    sourceFieldValue = RequiredIfFieldValue.BOOL_TRUE,
    targetFieldName = "dyeColor"
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY)
data class OcHairStyle(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    override val id: String? = null,
    val length: OcHairStyleLength,
    val baseColor: OcHairStyleColor,
    val variant: String,
    val dyed: Boolean,
    val dyeColor: String?,
) : OcCharacterTrait

enum class OcHairStyleLength {
    SHAVED, SHORT, MEDIUM, LONG
}

enum class OcHairStyleColor {
    BLONDE, BRUNETTE, RED, BLACK, WHITE, GRAY
}
