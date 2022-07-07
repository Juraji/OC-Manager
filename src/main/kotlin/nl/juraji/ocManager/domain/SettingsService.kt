package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.application.ApplicationSettingsRepository
import nl.juraji.ocManager.domain.application.OcApplicationSettings
import nl.juraji.ocManager.domain.application.SettingsRepository
import nl.juraji.ocManager.domain.application.OcSettings
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

@Service
class SettingsService(
    private val applicationSettingsRepository: ApplicationSettingsRepository,
    private val settingsRepository: SettingsRepository,
) {
    fun getApplicationSettings(): Mono<OcApplicationSettings> =
        applicationSettingsRepository
            .findSingleton()
            .switchIfEmpty { Mono.just(OcApplicationSettings()) }


    fun updateApplicationSettings(ocApplicationSettings: OcApplicationSettings): Mono<OcApplicationSettings> =
        getApplicationSettings()
            .map { ocApplicationSettings.copy(id = it.id) }
            .flatMap(applicationSettingsRepository::save)

    fun getSettings(): Mono<OcSettings> =
        settingsRepository
            .findSingleton()
            .switchIfEmpty { Mono.just(OcSettings()) }

    fun updateSettings(settings: OcSettings): Mono<OcSettings> =
        getSettings()
            .map { settings.copy(id = it.id) }
            .flatMap(settingsRepository::save)
}
