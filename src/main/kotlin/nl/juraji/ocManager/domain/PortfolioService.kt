package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import nl.juraji.ocManager.domain.portfolios.PortfolioCharacterRepository
import nl.juraji.ocManager.domain.portfolios.PortfolioRepository
import nl.juraji.ocManager.util.orElseEntityNotFound
import nl.juraji.ocManager.util.orElseRelationshipNotCreated
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class PortfolioService(
    private val portfolioRepository: PortfolioRepository,
    private val portfolioCharacterRepository: PortfolioCharacterRepository
) {
    fun getAllPortfolios(): Flux<OcPortfolio> =
        portfolioRepository.findAll()

    fun getPortfolioById(portfolioId: String): Mono<OcPortfolio> =
        portfolioRepository
            .findById(portfolioId)
            .orElseEntityNotFound(OcPortfolio::class, portfolioId)

    fun getDefaultPortfolio() =
        portfolioRepository.findDefaultPortfolio()

    fun createPortfolio(portfolio: OcPortfolio): Mono<OcPortfolio> =
        portfolioRepository.save(portfolio.copy(id = null))

    fun updatePortfolio(
        portfolioId: String,
        portfolio: OcPortfolio
    ): Mono<OcPortfolio> =
        getPortfolioById(portfolioId)
            .map { portfolio.copy(id = it.id) }
            .flatMap(portfolioRepository::save)

    fun deletePortfolio(portfolioId: String): Mono<Void> =
        getPortfolioById(portfolioId)
            .filter { !it.default }
            .orElseEntityNotFound(OcPortfolio::class, portfolioId)
            .then(portfolioRepository.deleteById(portfolioId))


    fun getPortfolioCharacters(portfolioId: String): Flux<OcCharacter> =
        portfolioCharacterRepository.findAllPortfolioCharacters(portfolioId)

    fun addCharacterToPortfolio(portfolioId: String, characterId: String): Mono<OcCharacter> =
        portfolioCharacterRepository
            .addCharacterToPortfolio(portfolioId, characterId)
            .orElseRelationshipNotCreated(OcPortfolio::class, OcCharacter::class, portfolioId, characterId)

    fun removeCharacterFromPortfolio(portfolioId: String, characterId: String): Mono<Void> =
        portfolioCharacterRepository
            .removeCharacterFromPortfolio(portfolioId, characterId)
}
