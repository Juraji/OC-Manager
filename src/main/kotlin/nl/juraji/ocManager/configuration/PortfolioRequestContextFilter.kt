package nl.juraji.ocManager.configuration

import nl.juraji.ocManager.domain.PortfolioService
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
                .contextWrite { it.put(CONTEXT_PORTFOLIO_ID, p.id!!) }
        }

    companion object {
        const val HEADER_PORTFOLIO = "X-OC-Context-Portfolio"
        const val CONTEXT_PORTFOLIO_ID = "OC_CONTEXT_PORTFOLIO_ID"
    }
}

val ContextView.requestPortfolioId: String
    get() = this[PortfolioRequestContextFilter.CONTEXT_PORTFOLIO_ID]
