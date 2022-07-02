package nl.juraji.ocManager.domain.characters

import com.fasterxml.jackson.annotation.JsonProperty


data class OcCharacterRelationship(
    val id: String? = null,
    val type: OcCharacterRelationshipType,
    val description: String,
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    val sourceCharacterId: String,
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    val targetCharacterId: String
)

enum class OcCharacterRelationshipType {
    FAMILY, ROMANTIC, FRIENDSHIP
}
