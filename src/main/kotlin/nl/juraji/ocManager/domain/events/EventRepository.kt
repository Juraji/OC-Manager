package nl.juraji.ocManager.domain.events

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.stereotype.Repository

@Repository
interface EventRepository: ReactiveNeo4jRepository<OcEvent, String> {
}
