package nl.juraji.ocManager.configuration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import nl.juraji.ocManager.domain.SettingsService
import nl.juraji.ocManager.domain.TraitService
import nl.juraji.ocManager.domain.application.OcApplicationSettings
import nl.juraji.ocManager.domain.traits.*
import nl.juraji.ocManager.util.LoggerCompanion
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.beans.factory.InitializingBean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import reactor.core.publisher.Flux
import reactor.core.scheduler.Schedulers
import reactor.kotlin.core.publisher.toFlux
import java.nio.file.Files

@Configuration
class SetupConfiguration(
    private val configuration: OcManagerConfiguration,
    private val settingsService: SettingsService,
    private val objectMapper: ObjectMapper,
    private val traitService: TraitService,
) : InitializingBean {

    override fun afterPropertiesSet() {
        logger.info("OC Manager setup...")
        initializeDataDirectories()
        initializeDefaultCharacterTraits()
    }

    private fun initializeDataDirectories() {
        listOf(configuration.dataDir, configuration.thumbnailDir)
            .toFlux()
            .subscribeOn(Schedulers.boundedElastic())
            .filter(Files::notExists)
            .map(Files::createDirectories)
            .doOnSubscribe { logger.info("Checking data directories...") }
            .doOnComplete { logger.info("Data directories verified") }
            .doOnError { logger.warn("Data directories verification failed", it) }
            .subscribe()
    }

    private fun initializeDefaultCharacterTraits() {
        // Body types
        val bodyTypes: Flux<OcCharacterTrait> = objectMapper
            .readValue<List<OcBodyType>>(ClassPathResource("defaults/OcBodyType.json").file)
            .toFlux()
            .flatMap(traitService::createBodyType)

        // Ethnicities
        val ethnicities: Flux<OcCharacterTrait> = objectMapper
            .readValue<List<OcEthnicity>>(ClassPathResource("defaults/OcEthnicity.json").file)
            .toFlux()
            .flatMap(traitService::createEthnicity)

        // Eye colors
        val eyeColors: Flux<OcCharacterTrait> = objectMapper
            .readValue<List<OcEyeColor>>(ClassPathResource("defaults/OcEyeColor.json").file)
            .toFlux()
            .flatMap(traitService::createEyeColor)

        // Genders
        val genders: Flux<OcCharacterTrait> = objectMapper
            .readValue<List<OcGender>>(ClassPathResource("defaults/OcGender.json").file)
            .toFlux()
            .flatMap(traitService::createGender)

        // Sexualities
        val sexualities: Flux<OcCharacterTrait> = objectMapper
            .readValue<List<OcSexuality>>(ClassPathResource("defaults/OcSexuality.json").file)
            .toFlux()
            .flatMap(traitService::createSexuality)

        // Hairstyles
        val hairstyles: Flux<OcCharacterTrait> = objectMapper
            .readValue<List<OcHairStyle>>(ClassPathResource("defaults/OcHairStyle.json").file)
            .toFlux()
            .flatMap(traitService::createHairStyle)

        settingsService
            .getApplicationSettings()
            .orElseEntityNotFound(OcApplicationSettings::class)
            .filter { !it.defaultTraitsInitialized }
            .doOnNext { logger.info("Setting up default character traits...") }
            .flatMap {
                Flux.concat(bodyTypes, ethnicities, eyeColors, genders, sexualities, hairstyles)
                    .collectList()
                    .then(settingsService.updateApplicationSettings(it.copy(defaultTraitsInitialized = true)))
            }
            .doOnError { logger.warn("Data directories verification failed", it) }
            .doOnNext { logger.info("Default character traits set up successfully") }
            .subscribe()
    }

    companion object : LoggerCompanion(SetupConfiguration::class)
}
