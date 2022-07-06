package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.PortfolioService
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController("/portfolios")
class PortfolioController(
    private val portfolioService: PortfolioService
) {
    @GetMapping
    fun getAllPortfolios(): Flux<OcPortfolio> = portfolioService.getAllPortfolios()

    @GetMapping("/{portfolioId}")
    fun getPortfolioById(
        @PathVariable portfolioId: String
    ): Mono<OcPortfolio> = portfolioService.getPortfolioById(portfolioId)

    @PostMapping
    fun createPortfolio(
        @Valid @RequestBody portfolio: OcPortfolio
    ): Mono<OcPortfolio> = portfolioService.createPortfolio(portfolio)

    @PutMapping("/{portfolioId}")
    fun updatePortfolio(
        @PathVariable portfolioId: String,
        @Valid @RequestBody portfolio: OcPortfolio
    ): Mono<OcPortfolio> = portfolioService.updatePortfolio(portfolioId, portfolio)

    @DeleteMapping("/{portfolioId}")
    fun deletePortfolio(
        @PathVariable portfolioId: String
    ): Mono<Void> = portfolioService.deletePortfolio(portfolioId)

    @GetMapping("/{portfolioId}/characters")
    fun getPortfolioCharacters(
        @PathVariable portfolioId: String
    ): Flux<OcCharacter> = portfolioService.getPortfolioCharacters(portfolioId)

    @PostMapping("/{portfolioId}/characters/{characterId}")
    fun addCharacterToPortfolio(
        @PathVariable portfolioId: String,
        @PathVariable characterId: String
    ): Mono<OcCharacter> = portfolioService.addCharacterToPortfolio(portfolioId, characterId)

    @DeleteMapping("/{portfolioId}/characters/{characterId}")
    fun removeCharacterFromPortfolio(
        @PathVariable portfolioId: String,
        @PathVariable characterId: String
    ): Mono<Void> = portfolioService.removeCharacterFromPortfolio(portfolioId, characterId)
}
