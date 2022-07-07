package nl.juraji.ocManager.domain.memories

import nl.juraji.ocManager.domain.characters.OcCharacter
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface MemoryCharactersRepository : ReactiveNeo4jRepository<OcCharacter, String> {

    @Query(
        """
            MATCH (:OcMemory {id: $ memoryId})-[:INVOLVES]->(character:OcCharacters)
            RETURN character
        """
    )
    fun findMemoryCharacters(memoryId: String): Flux<OcCharacter>

    @Query(
        """
            MATCH (e:OcMemory {id: $ memoryId})
            MATCH (c:OcCharacter {id: $ characterId})

            MERGE (e)-[:INVOLVES]->(c)
            RETURN c
        """
    )
    fun addCharacterToMemory(memoryId: String, characterId: String): Mono<OcCharacter>

    @Query(
        """
            MATCH (:OcMemory {id :$ memoryId})-[rel:INVOLVES]->(:OcCharacter {id: $ characterId})
            DELETE rel
        """
    )
    fun removeCharacterFromMemory(memoryId: String, characterId: String): Mono<Void>
}
