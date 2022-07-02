package nl.juraji.ocManager.domain.application

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ApplicationSettingsRepository : ReactiveNeo4jRepository<OcApplicationSettings, String> {

    @Query("MATCH (n:OcApplicationSettings) RETURN n")
    fun findSingleton(): Mono<OcApplicationSettings>
}
