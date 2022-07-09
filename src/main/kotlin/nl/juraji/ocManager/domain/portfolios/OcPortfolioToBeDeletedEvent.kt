package nl.juraji.ocManager.domain.portfolios

import nl.juraji.ocManager.domain.applicationEvents.OcEntityToBeDeletedEvent

data class OcPortfolioToBeDeletedEvent(
    override val entityId: String
) : OcEntityToBeDeletedEvent
