package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.application.OcSettings
import nl.juraji.ocManager.domain.application.SettingsRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty

@Service
class SettingsService(
    private val settingsRepository: SettingsRepository,
) {
    fun getSettings(): Mono<OcSettings> =
        settingsRepository
            .findSingleton()
            .switchIfEmpty { Mono.just(OcSettings()) }

    fun updateSettings(settings: OcSettings): Mono<OcSettings> =
        updateSettingsInternal {
            settings.copy(defaultTraitsInitialized = it.defaultTraitsInitialized)
        }

    fun updateSettingsInternal(mapper: (OcSettings) -> OcSettings): Mono<OcSettings> =
        getSettings()
            .map { mapper(it).copy(id = it.id) }
            .flatMap(settingsRepository::save)
}
