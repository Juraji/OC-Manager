package nl.juraji.ocManager.domain.traits

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.stereotype.Repository

@Repository
interface GenderPreferenceRepository: ReactiveNeo4jRepository<OcGenderPreference, String> {
}
