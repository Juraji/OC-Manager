package nl.juraji.ocManager.domain.characters

import javax.validation.constraints.NotBlank

data class OcCharacterRelationship(
    val id: String? = null,
    val type: OcCharacterRelationshipType,
    val description: String,
    @NotBlank
    val sourceCharacterId: String,
    @NotBlank
    val targetCharacterId: String
)

enum class OcCharacterRelationshipType {
    FAMILY, ROMANTIC, FRIENDSHIP
}
