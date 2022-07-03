package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.events.EventCharactersRepository
import nl.juraji.ocManager.domain.events.EventRepository
import nl.juraji.ocManager.domain.events.OcEvent
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

    fun getAllEvents(): Flux<OcEvent> =
        eventRepository.findAll()

    fun getEventById(eventId: String): Mono<OcEvent> =
        eventRepository
            .findById(eventId)
            .orElseEntityNotFound(OcEvent::class, eventId)

    fun getAllByCharacterId(characterId: String): Flux<OcEvent> =
        eventRepository.findAllByCharacterId(characterId)

    fun createEvent(event: OcEvent): Mono<OcEvent> =
        eventRepository.save(event)

    fun updateEvent(eventId: String, event: OcEvent): Mono<OcEvent> =
        getEventById(eventId)
            .map { event.copy(id = it.id) }
            .flatMap(eventRepository::save)

    fun deleteEvent(eventId: String): Mono<Void> =
        eventRepository.deleteById(eventId)

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
}
