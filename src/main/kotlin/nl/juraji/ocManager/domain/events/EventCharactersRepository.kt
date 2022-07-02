package nl.juraji.ocManager.domain.events

import nl.juraji.ocManager.domain.characters.OcCharacter
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface EventCharactersRepository : ReactiveNeo4jRepository<OcCharacter, String> {

    @Query(
        """
            MATCH (:OcEvent {id: $ eventId})-[:INVOLVES]->(character:OcCharacters)
            RETURN character
        """
    )
    fun findEventCharacters(eventId: String): Flux<OcCharacter>

    @Query(
        """
            MATCH (e:OcEvent {id: $ eventId})
            MATCH (c:OcCharacter {id: $ characterId})
            
            MERGE (e)-[:INVOLVES]->(c)
        """
    )
    fun addCharacterToEvent(eventId: String, characterId: String): Mono<Void>

    @Query(
        """
            MATCH (:OcEvent {id :$ eventId})-[rel:INVOLVES]->(:OcCharacter {id: $ characterId})
            DELETE rel
        """
    )
    fun removeCharacterFromEvent(eventId: String, characterId: String): Mono<Void>
}
