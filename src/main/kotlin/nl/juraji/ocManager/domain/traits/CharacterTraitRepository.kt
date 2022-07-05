package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.Neo4jDataClassMapper
import org.neo4j.driver.Record
import org.springframework.data.neo4j.core.DatabaseSelectionProvider
import org.springframework.data.neo4j.core.ReactiveNeo4jClient
import org.springframework.data.neo4j.core.mappedBy
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
class CharacterTraitRepository(
    private val neo4jClient: ReactiveNeo4jClient,
    private val databaseSelectionProvider: DatabaseSelectionProvider,
) {
    private val ocBodyTypeMapper = Neo4jDataClassMapper(OcBodyType::class)
    private val ocEthnicityMapper = Neo4jDataClassMapper(OcEthnicity::class)
    private val ocEyeColorMapper = Neo4jDataClassMapper(OcEyeColor::class)
    private val ocGenderMapper = Neo4jDataClassMapper(OcGender::class)
    private val ocHairStyleMapper = Neo4jDataClassMapper(OcHairStyle::class)
    private val ocSexualityMapper = Neo4jDataClassMapper(OcSexuality::class)

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

            OPTIONAL MATCH (character)-[existingTraitRel:HAS_TRAIT]->(existingTrait:OcCharacterTrait)
              WHERE labels(trait) = labels(existingTrait)
            DELETE existingTraitRel

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

        return when (traitLabel) {
            "OcBodyType" -> ocBodyTypeMapper.mapFrom(node.asMap())
            "OcEthnicity" -> ocEthnicityMapper.mapFrom(node.asMap())
            "OcEyeColor" -> ocEyeColorMapper.mapFrom(node.asMap())
            "OcGender" -> ocGenderMapper.mapFrom(node.asMap())
            "OcHairStyle" -> ocHairStyleMapper.mapFrom(node.asMap())
            "OcSexuality" -> ocSexualityMapper.mapFrom(node.asMap())
            else -> throw IllegalArgumentException("No mapper defined for trait label \"$traitLabel\"")
        }
    }
}
