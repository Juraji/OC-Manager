package nl.juraji.ocManager.domain.characters

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface CharacterRepository : ReactiveNeo4jRepository<OcCharacter, String> {

    @Query("MATCH (:OcPortfolio {id: $ portfolioId})-[:CONTAINS_CHARACTER]->(c:OcCharacter) RETURN c")
    fun findAllByPortfolioId(portfolioId: String): Flux<OcCharacter>

    @Query("MATCH (:OcPortfolio {id: $ portfolioId})-[:CONTAINS_CHARACTER]->(c:OcCharacter {id: $ characterId}) RETURN c")
    fun findPortfolioIdAndById(portfolioId: String, characterId: String): Mono<OcCharacter>

    @Query(
        """
            MATCH (p:OcPortfolio {id: $ portfolioId})
            MATCH (c:OcCharacter {id: $ characterId})

            MERGE (p)-[:CONTAINS_CHARACTER]->(c)
            RETURN c
        """
    )
    fun addCharacterToPortfolio(portfolioId: String, characterId: String): Mono<OcCharacter>
}
