package nl.juraji.ocManager.domain.memories

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface MemoryRepository : ReactiveNeo4jRepository<OcMemory, String> {

    @Query("MATCH (:OcPortfolio {id: $ portfolioId})-[:CONTAINS_MEMORY]->(e:OcMemory) RETURN e")
    fun findAllByPortfolioId(portfolioId: String): Flux<OcMemory>

    @Query("MATCH (:OcPortfolio {id: $ portfolioId})-[:CONTAINS_MEMORY]->(e:OcMemory {id: $ memoryId}) RETURN e")
    fun findByPortfolioIdAndId(portfolioId: String, memoryId: String): Mono<OcMemory>

    @Query("MATCH (:OcCharacter {id: $ characterId})<-[:INVOLVES]-(e:OcMemory) RETURN e")
    fun findAllByCharacterId(characterId: String): Flux<OcMemory>

    @Query(
        """
            MATCH (p:OcPortfolio {id: $ portfolioId})
            MATCH (e:OcMemory {id: $ memoryId})

            MERGE (p)-[:CONTAINS_MEMORY]->(e)
            RETURN e
        """
    )
    fun addMemoryToPortfolio(portfolioId: String, memoryId: String): Mono<OcMemory>
}
