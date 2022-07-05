package nl.juraji.ocManager.domain.characters

data class OcCharacterRelationship(
    val id: String? = null,
    val type: OcCharacterRelationshipType,
    val description: String,
    val sourceCharacterId: String,
    val targetCharacterId: String
)

enum class OcCharacterRelationshipType {
    FAMILY, ROMANTIC, FRIENDSHIP
}
