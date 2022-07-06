package nl.juraji.ocManager.domain.portfolios

import nl.juraji.ocManager.domain.characters.OcCharacter
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface PortfolioCharacterRepository : ReactiveNeo4jRepository<OcCharacter, String> {

    @Query(
        """
            MATCH (:OcPortfolio {id : $ portfolioId})-[:CONTAINS_CHARACTER]->(char:OcCharacter)
            RETURN char
        """
    )
    fun findAllPortfolioCharacters(portfolioId: String): Flux<OcCharacter>

    @Query(
        """
            MATCH (p:OcPortfolio {id : $ portfolioId})
            MATCH (char:OcCharacter {id: $ characterId})

            MERGE (p)-[:CONTAINS_CHARACTER]->(char)
            RETURN char
        """
    )
    fun addCharacterToPortfolio(portfolioId: String, characterId: String): Mono<OcCharacter>

    @Query(
        """
            MATCH (:OcPortfolio {id : $ portfolioId})-[rel:CONTAINS_CHARACTER]->(:OcCharacter {id: $ characterId})
            DELETE rel
        """
    )
    fun removeCharacterFromPortfolio(portfolioId: String, characterId: String): Mono<Void>
}
