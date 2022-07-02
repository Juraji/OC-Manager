package nl.juraji.ocManager.domain.characters

import nl.juraji.ocManager.util.uuid
import java.nio.file.Path
import java.time.Instant

fun mockOcCharacter() = uuid().let {
    OcCharacter(
        id = it,
        name = "Test character $it",
        nickname = "Test character nickname $it",
        dateOfBirth = Instant.EPOCH,
        customProperties = mapOf(
            "Test uuid" to "Uuid: $it",
            "Fixed prop" to "Some value"
        ),
        thumbnail = Path.of("./non-existent_$it.jpg")
    )
}

fun mockOcCharacterRelationship() = uuid().let {
    OcCharacterRelationship(
        id = it,
        type = OcCharacterRelationshipType.FAMILY,
        description = "Relationship description $it",
        sourceCharacterId = uuid(),
        targetCharacterId = uuid()
    )
}
