package nl.juraji.ocManager.domain.application

import nl.juraji.ocManager.util.persistence.SingletonEntityIdGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node

@Node
data class OcApplicationSettings(
    @Id @GeneratedValue(SingletonEntityIdGenerator::class)
    val id: String? = null,
    val defaultTraitsInitialized: Boolean = false
)
