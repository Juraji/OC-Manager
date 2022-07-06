package nl.juraji.ocManager.domain.events

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface EventRepository : ReactiveNeo4jRepository<OcEvent, String> {

    @Query("MATCH (:OcPortfolio {id: $ portfolioId})-[:CONTAINS_EVENT]->(e:OcEvent) RETURN e")
    fun findAllByPortfolioId(portfolioId: String): Flux<OcEvent>

    @Query("MATCH (:OcPortfolio {id: $ portfolioId})-[:CONTAINS_EVENT]->(e:OcEvent {id: $ eventId}) RETURN e")
    fun findByPortfolioIdAndId(portfolioId: String, eventId: String): Mono<OcEvent>

    @Query("MATCH (:OcCharacter {id: $ characterId})<-[:INVOLVES]-(e:OcEvent) RETURN e")
    fun findAllByCharacterId(characterId: String): Flux<OcEvent>

    @Query(
        """
            MATCH (p:OcPortfolio {id: $ portfolioId})
            MATCH (e:OcEvent {id: $ eventId})

            MERGE (p)-[:CONTAINS_EVENT]->(e)
            RETURN e
        """
    )
    fun addEventToPortfolio(portfolioId: String, eventId: String): Mono<OcEvent>
}
