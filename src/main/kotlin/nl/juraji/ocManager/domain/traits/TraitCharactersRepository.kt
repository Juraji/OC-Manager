package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.domain.characters.OcCharacter
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface TraitCharactersRepository : ReactiveNeo4jRepository<OcCharacter, String> {
    @Query("MATCH (:OcCharacterTrait {id: $ traitId})<-[:HAS_TRAIT]-(char:OcCharacter) RETURN char")
    fun findAllCharactersWithTrait(traitId: String): Flux<OcCharacter>
}
