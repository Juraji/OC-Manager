package nl.juraji.ocManager.configuration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import nl.juraji.ocManager.domain.CharacterTraitService
import nl.juraji.ocManager.domain.PortfolioService
import nl.juraji.ocManager.domain.SettingsService
import nl.juraji.ocManager.domain.application.OcSettings
import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import nl.juraji.ocManager.domain.traits.OcCharacterTrait
import nl.juraji.ocManager.util.LoggerCompanion
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.beans.factory.InitializingBean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import reactor.core.publisher.Flux
import reactor.kotlin.core.publisher.toFlux
import reactor.kotlin.core.publisher.toMono

@Configuration
class SetupConfiguration(
    private val settingsService: SettingsService,
    private val objectMapper: ObjectMapper,
    private val traitService: CharacterTraitService,
    private val portfolioService: PortfolioService,
) : InitializingBean {

    override fun afterPropertiesSet() {
        logger.info("OC Manager setup...")
        initializeDefaultCharacterTraits()
        initializeDefaultPortfolio()
    }

    private fun initializeDefaultCharacterTraits() {
        val characterTraits: Flux<OcCharacterTrait> = objectMapper
            .readValue<List<OcCharacterTrait>>(ClassPathResource("default-character-traits.json").inputStream)
            .toFlux()
            .flatMap(traitService::createCharacterTrait)

        settingsService
            .getSettings()
            .orElseEntityNotFound(OcSettings::class)
            .filter { !it.defaultTraitsInitialized }
            .doOnNext { logger.info("Setting up default character traits...") }
            .flatMap {
                characterTraits
                    .collectList()
                    .then(settingsService.updateSettingsInternal { it.copy(defaultTraitsInitialized = true) })
            }
            .doOnError { logger.warn("Default character traits setup failed", it) }
            .doOnNext { logger.info("Default character traits set up successfully") }
            .subscribe()
    }

    private fun initializeDefaultPortfolio() {
        val createDefaultPortfolio = objectMapper
            .readValue<OcPortfolio>(ClassPathResource("default-portfolio.json").inputStream)
            .toMono()
            .doOnNext { logger.info("Setting up default portfolio...") }
            .map { it.copy(default = true) }
            .flatMap(portfolioService::createPortfolio)
            .doOnError { logger.warn("Default portfolio setup failed", it) }
            .doOnNext { logger.info("Default portfolio set up successfully") }

        portfolioService
            .getAllPortfolios()
            .toMono()
            .switchIfEmpty(createDefaultPortfolio)
            .subscribe()
    }

    companion object : LoggerCompanion(SetupConfiguration::class)
}
