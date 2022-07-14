package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.Neo4jDataClassMapper
import nl.juraji.ocManager.util.toMap
import org.neo4j.driver.Record
import org.springframework.data.neo4j.core.DatabaseSelectionProvider
import org.springframework.data.neo4j.core.ReactiveNeo4jClient
import org.springframework.data.neo4j.core.mappedBy
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*

@Repository
class CharacterTraitRepository(
    private val neo4jClient: ReactiveNeo4jClient,
    private val databaseSelectionProvider: DatabaseSelectionProvider,
) {
    private val traitMappers = mapOf(
        "OcBodyType" to Neo4jDataClassMapper(OcBodyType::class),
        "OcEthnicity" to Neo4jDataClassMapper(OcEthnicity::class),
        "OcEyeColor" to Neo4jDataClassMapper(OcEyeColor::class),
        "OcGender" to Neo4jDataClassMapper(OcGender::class),
        "OcHairStyle" to Neo4jDataClassMapper(OcHairStyle::class),
        "OcHairDye" to Neo4jDataClassMapper(OcHairDye::class),
        "OcSexuality" to Neo4jDataClassMapper(OcSexuality::class),
        "OcCustomTrait" to Neo4jDataClassMapper(OcCustomTrait::class),
    )

    fun findAll(): Flux<OcCharacterTrait> = neo4jClient
        .query("MATCH (trait:OcCharacterTrait) RETURN trait")
        .`in`(databaseSelectionProvider.databaseSelection.value)
        .mappedBy { _, record -> mapRecordAsTrait(record) }
        .all()

    fun findById(traitId: String): Mono<OcCharacterTrait> = neo4jClient
        .query("MATCH (trait:OcCharacterTrait {id: $ traitId}) RETURN trait")
        .`in`(databaseSelectionProvider.databaseSelection.value)
        .bind(traitId).to("traitId")
        .mappedBy { _, record -> mapRecordAsTrait(record) }
        .one()

    fun save(trait: OcCharacterTrait): Mono<OcCharacterTrait> {
        val traitProperties = trait.toMap("id", stringifyEnums = true)

        val traitId = trait.id ?: UUID.randomUUID().toString()
        val traitLabel = trait::class.simpleName

        return neo4jClient
            .query(
                """
                    MERGE (trait:OcCharacterTrait {id: $ traitId})
                    ON CREATE SET trait:$traitLabel
                    SET trait += $ traitProperties
                    RETURN trait
                """.trimIndent()
            )
            .`in`(databaseSelectionProvider.databaseSelection.value)
            .bind(traitId).to("traitId")
            .bind(traitProperties).to("traitProperties")
            .mappedBy { _, record -> mapRecordAsTrait(record) }
            .one()
    }

    fun deleteById(traitId: String): Mono<Void> = neo4jClient
        .query(
            """
                MATCH (trait:OcCharacterTrait {id: $ traitId})
                DETACH DELETE trait
            """.trimIndent()
        )
        .`in`(databaseSelectionProvider.databaseSelection.value)
        .bind(traitId).to("traitId")
        .run()
        .then()

    fun findAllByCharacterId(characterId: String): Flux<OcCharacterTrait> = neo4jClient
        .query(
            """
                MATCH (character:OcCharacter {id: $ characterId})-[:HAS_TRAIT]->(trait:OcCharacterTrait)
                RETURN trait
            """.trimIndent()
        )
        .`in`(databaseSelectionProvider.databaseSelection.value)
        .bind(characterId).to("characterId")
        .mappedBy { _, record -> mapRecordAsTrait(record) }
        .all()

    fun addTraitToCharacter(characterId: String, traitId: String): Mono<OcCharacterTrait> = neo4jClient
        .query(
            """
            MATCH (character:OcCharacter {id: $ characterId})
            MATCH (trait:OcCharacterTrait {id: $ traitId})

            MERGE (character)-[:HAS_TRAIT]->(trait)
            RETURN trait
        """.trimIndent()
        )
        .`in`(databaseSelectionProvider.databaseSelection.value)
        .bind(characterId).to("characterId")
        .bind(traitId).to("traitId")
        .mappedBy { _, record -> mapRecordAsTrait(record) }
        .one()

    fun removeTraitFromCharacter(characterId: String, traitId: String): Mono<Void> = neo4jClient
        .query(
            """
                MATCH (character:OcCharacter {id: $ characterId})-[rel:HAS_TRAIT]->(:OcCharacterTrait {id: $ traitId})
                DELETE rel
            """.trimIndent()
        )
        .`in`(databaseSelectionProvider.databaseSelection.value)
        .bind(characterId).to("characterId")
        .bind(traitId).to("traitId")
        .run()
        .then()

    private fun mapRecordAsTrait(record: Record): OcCharacterTrait {
        val node = record["trait"].asNode()
        val traitLabel = node.labels().first { it != "OcCharacterTrait" }

        return traitMappers[traitLabel]
            ?.mapFrom(node.asMap())
            ?: throw IllegalArgumentException("No mapper defined for trait label \"$traitLabel\"")
    }
}
