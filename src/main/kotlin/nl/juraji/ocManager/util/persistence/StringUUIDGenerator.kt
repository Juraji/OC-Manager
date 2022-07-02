package nl.juraji.ocManager.util.persistence

import org.springframework.data.neo4j.core.schema.IdGenerator
import java.util.UUID

class StringUUIDGenerator : IdGenerator<String> {
    override fun generateId(primaryLabel: String, entity: Any): String =
        UUID.randomUUID().toString()
}
