package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.SettingsService
import nl.juraji.ocManager.domain.events.OcSettings
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("/api/settings")
class UserSettingsController(
    private val settingsService: SettingsService
) {
    @GetMapping
    fun getEventSettings(): Mono<OcSettings> =
        settingsService.getEventSettings()

    @PutMapping
    fun updateEventSettings(
        @Valid @RequestBody eventSettings: OcSettings
    ) = settingsService.updateEventSettings(eventSettings)
}
