package nl.juraji.ocManager.domain.events

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface EventSettingsRepository : ReactiveNeo4jRepository<OcSettings, String> {

    @Query("MATCH (n:OcEventSettings) RETURN n")
    fun findSingleton(): Mono<OcSettings>
}
