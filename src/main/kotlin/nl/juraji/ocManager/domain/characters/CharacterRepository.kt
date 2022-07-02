package nl.juraji.ocManager.domain.characters

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.stereotype.Repository

@Repository
interface CharacterRepository : ReactiveNeo4jRepository<OcCharacter, String>
