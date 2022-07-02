package nl.juraji.ocManager.configuration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import nl.juraji.ocManager.domain.SettingsService
import nl.juraji.ocManager.domain.TraitService
import nl.juraji.ocManager.domain.traits.*
import nl.juraji.ocManager.util.LoggerCompanion
import org.springframework.beans.factory.InitializingBean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import reactor.core.publisher.Flux
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

        logger.info("OC Manager setup finished!")
    }

    private fun initializeDataDirectories() {
        logger.info("Checking data directories...")
        if (Files.notExists(configuration.dataDir)) Files.createDirectories(configuration.dataDir)
        if (Files.notExists(configuration.thumbnailDir)) Files.createDirectories(configuration.thumbnailDir)
    }

    private fun initializeDefaultCharacterTraits() {
        val settings = settingsService.getApplicationSettings().block()!!
        if (settings.defaultTraitsInitialized) return

        logger.info("Setting up default character traits...")

        // Body types
        val bodyTypes = objectMapper
            .readValue<List<OcBodyType>>(ClassPathResource("traits/OcBodyType.json").file)
            .toFlux()
            .flatMap(traitService::createBodyType)

        // Ethnicities
        val ethnicities = objectMapper
            .readValue<List<OcEthnicity>>(ClassPathResource("traits/OcEthnicity.json").file)
            .toFlux()
            .flatMap(traitService::createEthnicity)

        // Eye colors
        val eyeColors = objectMapper
            .readValue<List<OcEyeColor>>(ClassPathResource("traits/OcEyeColor.json").file)
            .toFlux()
            .flatMap(traitService::createEyeColor)

        // Gender preferences
        val genderPreferences = objectMapper
            .readValue<List<OcGenderPreference>>(ClassPathResource("traits/OcGenderPreference.json").file)
            .toFlux()
            .flatMap(traitService::createGenderPreference)

        // Hairstyles
        val hairstyles = objectMapper
            .readValue<List<OcHairStyle>>(ClassPathResource("traits/OcHairStyle.json").file)
            .toFlux()
            .flatMap(traitService::createHairStyle)

        // Update app settings
        val updateAppSettings = settingsService
            .updateApplicationSettings(settings.copy(defaultTraitsInitialized = true))

        Flux.concat(bodyTypes, ethnicities, eyeColors, genderPreferences, hairstyles, updateAppSettings)
            .subscribe()
    }

    companion object : LoggerCompanion(SetupConfiguration::class)
}
