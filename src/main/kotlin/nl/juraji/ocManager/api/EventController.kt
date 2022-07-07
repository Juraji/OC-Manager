package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.EventService
import nl.juraji.ocManager.domain.SettingsService
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.events.OcEvent
import nl.juraji.ocManager.domain.events.OcEventSettings
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("/api/events")
class EventController(
    private val eventService: EventService,
    private val settingsService: SettingsService,
) {
    @GetMapping
    fun getAllEvents() = eventService.getAllEvents()

    @GetMapping("/{eventId}")
    fun getEventById(
        @PathVariable eventId: String
    ): Mono<OcEvent> = eventService.getEventById(eventId)

    @PostMapping
    fun createEvent(
        @Valid @RequestBody event: OcEvent
    ): Mono<OcEvent> = eventService.createEvent(event)

    @PutMapping("/{eventId}")
    fun updateEvent(
        @PathVariable eventId: String,
        @Valid @RequestBody event: OcEvent
    ): Mono<OcEvent> = eventService.updateEvent(eventId, event)

    @DeleteMapping("/{eventId}")
    fun deleteEvent(
        @PathVariable eventId: String
    ): Mono<Void> = eventService.deleteEvent(eventId)

    @GetMapping("/{eventId}/characters")
    fun getEventCharacters(
        @PathVariable eventId: String
    ): Flux<OcCharacter> = eventService.getEventCharacters(eventId)

    @PostMapping("/{eventId}/characters/{characterId}")
    fun addCharacterToEvent(
        @PathVariable eventId: String,
        @PathVariable characterId: String,
    ): Mono<Void> = eventService.addCharacterToEvent(eventId, characterId)

    @GetMapping("/{eventId}/characters/{characterId}")
    fun removeCharacterFromEvent(
        @PathVariable eventId: String,
        @PathVariable characterId: String,
    ): Mono<Void> = eventService.removeCharacterFromEvent(eventId, characterId)

    @GetMapping("/settings")
    fun getEventSettings(): Mono<OcEventSettings> = settingsService.getEventSettings()

    @PutMapping("/settings")
    fun updateEventSettings(
        @Valid @RequestBody eventSettings: OcEventSettings
    ) = settingsService.updateEventSettings(eventSettings)
}
