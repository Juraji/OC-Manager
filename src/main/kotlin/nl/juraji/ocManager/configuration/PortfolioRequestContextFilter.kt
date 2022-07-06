package nl.juraji.ocManager.configuration

import nl.juraji.ocManager.domain.PortfolioService
import nl.juraji.ocManager.domain.portfolios.OcPortfolio
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import reactor.util.context.ContextView

@Component
class PortfolioRequestContextFilter(
    private val portfolioService: PortfolioService,
) : WebFilter {

    override fun filter(
        exchange: ServerWebExchange,
        chain: WebFilterChain
    ): Mono<Void> = Mono
        .justOrEmpty(exchange.request.headers.getFirst(HEADER_PORTFOLIO))
        .flatMap(portfolioService::getPortfolioById)
        .switchIfEmpty(portfolioService::getDefaultPortfolio)
        .flatMap { p ->
            chain
                .filter(exchange)
                .contextWrite { it.put(CONTEXT_PORTFOLIO, p) }
        }

    companion object {
        const val HEADER_PORTFOLIO = "X-OC-Context-Portfolio"
        const val CONTEXT_PORTFOLIO = "OC_CONTEXT_PORTFOLIO"
    }
}

fun ContextView.getRequestPortfolio(): OcPortfolio =
    this[PortfolioRequestContextFilter.CONTEXT_PORTFOLIO]
