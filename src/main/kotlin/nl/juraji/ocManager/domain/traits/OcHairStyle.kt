package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node

@Node("OcHairStyle", "OcCharacterTrait")
data class OcHairStyle(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    override val id: String? = null,
    val length: OcHairStyleLength,
    val baseColor: OcHairStyleColor,
    val variant: String,
) : OcCharacterTrait
