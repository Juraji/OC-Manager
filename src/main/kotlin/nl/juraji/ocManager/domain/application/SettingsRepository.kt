package nl.juraji.ocManager.domain.application

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface SettingsRepository : ReactiveNeo4jRepository<OcSettings, String> {

    @Query("MATCH (n:OcSettings) RETURN n")
    fun findSingleton(): Mono<OcSettings>
}
