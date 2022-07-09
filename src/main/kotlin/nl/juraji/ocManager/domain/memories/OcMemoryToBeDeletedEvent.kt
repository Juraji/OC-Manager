package nl.juraji.ocManager.domain.memories

import nl.juraji.ocManager.domain.applicationEvents.OcEntityToBeDeletedEvent

data class OcMemoryToBeDeletedEvent(
    override val entityId: String
) : OcEntityToBeDeletedEvent
