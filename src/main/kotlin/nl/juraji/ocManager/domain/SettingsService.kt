package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.application.ApplicationSettingsRepository
import nl.juraji.ocManager.domain.application.OcApplicationSettings
import nl.juraji.ocManager.domain.events.EventSettingsRepository
import nl.juraji.ocManager.domain.events.OcEventSettings
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

@Service
class SettingsService(
    private val applicationSettingsRepository: ApplicationSettingsRepository,
    private val eventSettingsRepository: EventSettingsRepository,
) {
    fun getApplicationSettings(): Mono<OcApplicationSettings> =
        applicationSettingsRepository
            .findSingleton()
            .switchIfEmpty { Mono.just(OcApplicationSettings()) }


    fun updateApplicationSettings(ocApplicationSettings: OcApplicationSettings): Mono<OcApplicationSettings> =
        getApplicationSettings()
            .map { ocApplicationSettings.copy(id = it.id) }
            .flatMap(applicationSettingsRepository::save)

    fun getEventSettings(): Mono<OcEventSettings> =
        eventSettingsRepository
            .findSingleton()
            .switchIfEmpty { Mono.just(OcEventSettings()) }

    fun updateEventSettings(eventSettings: OcEventSettings): Mono<OcEventSettings> =
        getEventSettings()
            .map { eventSettings.copy(id = it.id) }
            .flatMap(eventSettingsRepository::save)
}
