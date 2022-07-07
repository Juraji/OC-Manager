package nl.juraji.ocManager.domain.portfolios

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface PortfolioRepository : ReactiveNeo4jRepository<OcPortfolio, String> {
    @Query("MATCH (p:OcPortfolio {default: true}) RETURN p")
    fun findDefaultPortfolio(): Mono<OcPortfolio>

    @Query(
        """
            MATCH (p:OcPortfolio {id: $ portfolioId})
            OPTIONAL MATCH (p)-[:CONTAINS_CHARACTER]->(char:OcCharacter)
            OPTIONAL MATCH (p)-[:CONTAINS_MEMORY]->(event:OcMemory)

            DETACH DELETE p, char, event
        """
    )
    fun deletePortfolioCompletely(portfolioId: String): Mono<Void>
}
