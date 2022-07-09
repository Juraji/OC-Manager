package nl.juraji.ocManager.domain.applicationEvents

interface OcEvent

interface OcEntityToBeDeletedEvent : OcEvent {
    val entityId: String
}
