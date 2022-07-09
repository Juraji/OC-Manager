package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import nl.juraji.ocManager.domain.portfolios.OcPortfolioToBeDeletedEvent
import nl.juraji.ocManager.domain.portfolios.PortfolioRepository
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class PortfolioService(
    private val portfolioRepository: PortfolioRepository,
    private val eventPublisher: ApplicationEventPublisher,
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
            .map { portfolio.copy(id = it.id, default = it.default) }
            .flatMap(portfolioRepository::save)

    @Transactional
    fun deletePortfolio(portfolioId: String): Mono<Void> =
        getPortfolioById(portfolioId)
            .filter { !it.default }
            .doOnNext { eventPublisher.publishEvent(OcPortfolioToBeDeletedEvent(portfolioId)) }
            .flatMap(portfolioRepository::delete)
}
