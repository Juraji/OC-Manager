package nl.juraji.ocManager.domain

import nl.juraji.ocManager.configuration.requestPortfolioId
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.events.EventCharactersRepository
import nl.juraji.ocManager.domain.events.EventRepository
import nl.juraji.ocManager.domain.events.OcEvent
import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import nl.juraji.ocManager.util.flatMapContextual
import nl.juraji.ocManager.util.orElseEntityNotFound
import nl.juraji.ocManager.util.orElseRelationshipNotCreated
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class EventService(
    private val eventRepository: EventRepository,
    private val eventCharactersRepository: EventCharactersRepository,
) {

    fun getAllEvents(): Flux<OcEvent> = Flux
        .deferContextual { eventRepository.findAllByPortfolioId(it.requestPortfolioId) }

    fun getEventById(eventId: String): Mono<OcEvent> =
        eventRepository
            .findById(eventId)
            .orElseEntityNotFound(OcEvent::class, eventId)

    fun createEvent(event: OcEvent): Mono<OcEvent> =
        eventRepository
            .save(event.copy(id = null))
            .flatMapContextual { addEventToPortfolio(requestPortfolioId, it) }

    fun updateEvent(eventId: String, event: OcEvent): Mono<OcEvent> =
        getEventById(eventId)
            .map { event.copy(id = it.id) }
            .flatMap(eventRepository::save)

    fun deleteEvent(eventId: String): Mono<Void> =
        eventRepository.deleteById(eventId)

    fun getAllByCharacterId(characterId: String): Flux<OcEvent> =
        eventRepository.findAllByCharacterId(characterId)

    fun getEventCharacters(eventId: String): Flux<OcCharacter> =
        eventCharactersRepository.findEventCharacters(eventId)

    fun addCharacterToEvent(eventId: String, characterId: String): Mono<Void> =
        eventCharactersRepository
            .addCharacterToEvent(eventId, characterId)
            .orElseRelationshipNotCreated(OcEvent::class, OcCharacter::class, eventId, characterId)

    fun removeCharacterFromEvent(eventId: String, characterId: String): Mono<Void> =
        eventCharactersRepository
            .removeCharacterFromEvent(eventId, characterId)
            .orElseRelationshipNotCreated(OcEvent::class, OcCharacter::class, eventId, characterId)

    private fun addEventToPortfolio(portfolioId: String, event: OcEvent): Mono<OcEvent> =
        eventRepository
            .addEventToPortfolio(portfolioId, event.id!!)
            .orElseRelationshipNotCreated(OcPortfolio::class, OcEvent::class, portfolioId, event.id)
}
