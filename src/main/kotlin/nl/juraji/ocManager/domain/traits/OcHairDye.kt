package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node

@Node("OcHairDye", "OcCharacterTrait")
data class OcHairDye(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    override val id: String? = null,
    val baseColor: OcHairStyleColor,
    val variant: String,
    val outgrowth: Boolean,
) : OcCharacterTrait
