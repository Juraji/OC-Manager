package nl.juraji.ocManager.domain.portfolios

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface PortfolioRepository : ReactiveNeo4jRepository<OcPortfolio, String> {
    @Query("MATCH (p:OcPortfolio {default: true}) RETURN p")
    fun findDefaultPortfolio(): Mono<OcPortfolio>
}
