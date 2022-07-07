package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.SettingsService
import nl.juraji.ocManager.domain.application.OcSettings
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("/api/settings")
class UserSettingsController(
    private val settingsService: SettingsService
) {
    @GetMapping
    fun getSettings(): Mono<OcSettings> =
        settingsService.getSettings()

    @PutMapping
    fun updateSettings(
        @Valid @RequestBody settings: OcSettings
    ) = settingsService.updateSettings(settings)
}
