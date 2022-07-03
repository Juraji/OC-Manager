package nl.juraji.ocManager.domain.events

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface EventRepository : ReactiveNeo4jRepository<OcEvent, String> {

    @Query("MATCH (:OcCharacter {id: $ characterId})<-[:INVOLVES]-(e:OcEvent) RETURN e")
    fun findAllByCharacterId(characterId: String): Flux<OcEvent>
}
