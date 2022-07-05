package nl.juraji.ocManager.domain.characters

import nl.juraji.ocManager.util.Neo4jDataClassMapper
import nl.juraji.ocManager.util.toMap
import org.springframework.data.neo4j.core.DatabaseSelectionProvider
import org.springframework.data.neo4j.core.ReactiveNeo4jClient
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.UUID

@Repository
class CharacterRelationshipRepository(
    private val neo4jClient: ReactiveNeo4jClient,
    private val databaseSelectionProvider: DatabaseSelectionProvider,
) {
    private val mapper = Neo4jDataClassMapper(OcCharacterRelationship::class)

    fun findAllByCharacterId(characterId: String): Flux<OcCharacterRelationship> =
        neo4jClient
            .query(
                """
                    MATCH (source:OcCharacter {id: $ characterId})-[rel:RELATED_TO]-(target:OcCharacter)
                    $RELATIONSHIP_RETURN_STMT
                """.trimIndent()
            )
            .`in`(databaseSelectionProvider.databaseSelection.value)
            .bind(characterId).to("characterId")
            .fetch().all()
            .map(mapper::mapFrom)

    fun create(relationship: OcCharacterRelationship): Mono<OcCharacterRelationship> =
        neo4jClient
            .query(
                """
                    MATCH (source:OcCharacter {id: $ relationship.sourceCharacterId})
                    MATCH (target:OcCharacter {id: $ relationship.targetCharacterId})

                    MERGE (source)-[rel:RELATED_TO {id: $ relId}]->(target)
                    SET rel.type = $ relationship.type,
                        rel.description = $ relationship.description

                    $RELATIONSHIP_RETURN_STMT
                """.trimIndent()
            )
            .`in`(databaseSelectionProvider.databaseSelection.value)
            .bind(UUID.randomUUID().toString()).to("relId")
            .bind(relationship.toMap(stringifyEnums = true)).to("relationship")
            .fetch().one()
            .map(mapper::mapFrom)

    fun deleteById(relationshipId: String): Mono<Void> =
        neo4jClient
            .query(
                """
                    MATCH (:OcCharacter)-[rel:RELATED_TO {id: $ relId}]->(OcCharacter)
                    DELETE rel
                """.trimIndent()
            )
            .`in`(databaseSelectionProvider.databaseSelection.value)
            .bind(relationshipId).to("relId")
            .run()
            .then()

    companion object {
        // language=Cypher
        private const val RELATIONSHIP_RETURN_STMT = """
                    WITH source, target, rel
                    RETURN
                      rel.id AS id,
                      rel.type AS type,
                      rel.description AS description,
                      source.id AS sourceCharacterId,
                      target.id AS targetCharacterId
        """
    }
}
