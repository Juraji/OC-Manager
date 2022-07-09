package nl.juraji.ocManager.domain.characters

import nl.juraji.ocManager.domain.applicationEvents.OcEntityToBeDeletedEvent

data class OcCharacterToBeDeletedEvent(
    override val entityId: String
) : OcEntityToBeDeletedEvent
