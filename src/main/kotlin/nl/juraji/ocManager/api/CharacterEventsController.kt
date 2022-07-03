package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.EventService
import nl.juraji.ocManager.domain.events.OcEvent
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux

@RestController
@RequestMapping("/characters/{characterId}/events")
class CharacterEventsController(
    private val eventService: EventService
) {

    @GetMapping
    fun getAllByCharacterId(
        @PathVariable characterId: String
    ): Flux<OcEvent> = eventService.getAllByCharacterId(characterId)
}
