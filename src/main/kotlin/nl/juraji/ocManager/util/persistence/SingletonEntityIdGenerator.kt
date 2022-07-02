package nl.juraji.ocManager.util.persistence

import org.springframework.data.neo4j.core.schema.IdGenerator

class SingletonEntityIdGenerator : IdGenerator<String> {
    override fun generateId(primaryLabel: String, entity: Any): String = primaryLabel
}
