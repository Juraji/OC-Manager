package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.configuration.BaseTestHarnessConfiguration
import nl.juraji.ocManager.util.ReactiveDataNeo4jTest
import nl.juraji.ocManager.util.stepVerifier
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Import
import org.springframework.data.neo4j.core.ReactiveNeo4jClient
import org.springframework.data.neo4j.core.fetchAs

@ReactiveDataNeo4jTest
@Import(CharacterTraitRepository::class)
internal class CharacterTraitRepositoryTest {

    @Autowired
    private lateinit var repository: CharacterTraitRepository

    @Autowired
    private lateinit var neo4jClient: ReactiveNeo4jClient

    @Test
    fun `should set character trait`() {
        val characterId = "character#1"
        val traitId = "trait#2"
        val expected = OcEthnicity(id = "trait#2", label = "Trait 2")

        repository
            .addTraitToCharacter(characterId, traitId)
            .stepVerifier()
            .expectNext(expected)
            .verifyComplete()

        neo4jClient
            .query("RETURN exists((:OcCharacter {id: $ charId})-[:HAS_TRAIT]->(:OcCharacterTrait {id: $ traitId}))")
            .bind(characterId).to("charId")
            .bind(traitId).to("traitId")
            .fetchAs<Boolean>()
            .one()
            .stepVerifier()
            .expectNext(true)
            .verifyComplete()

        neo4jClient
            .query(
                """
                    MATCH (:OcCharacter {id: $ charId})-[rel:HAS_TRAIT]->(:OcEthnicity)
                    RETURN count(rel)
                """.trimIndent()
            )
            .bind(characterId).to("charId")
            .fetchAs<Int>()
            .one()
            .stepVerifier()
            .expectNext(1)
            .verifyComplete()
    }

    @Test
    fun `should remove character trait`() {
        val characterId = "character#2"
        val traitId = "trait#2"

        repository
            .removeTraitFromCharacter(characterId, traitId)
            .stepVerifier()
            .verifyComplete()

        neo4jClient
            .query("RETURN exists((:OcCharacter {id: $ charId})-[:HAS_TRAIT]->(:OcCharacterTrait {id: $ traitId}))")
            .bind(characterId).to("charId")
            .bind(traitId).to("traitId")
            .fetchAs<Boolean>()
            .one()
            .stepVerifier()
            .expectNext(false)
            .verifyComplete()
    }

    @Test
    fun `should get all character traits`() {
        val characterId = "character#3"
        val expectedTrait1 = OcBodyType(id = "trait#3", label = "Trait 3")
        val expectedTrait2 = OcEthnicity(id = "trait#1", label = "Trait 1")

        repository
            .findAllByCharacterId(characterId)
            .stepVerifier()
            .expectNext(expectedTrait1, expectedTrait2)
            .verifyComplete()
    }

    @TestConfiguration
    class TestHarnessConfiguration : BaseTestHarnessConfiguration() {

        // language=Cypher
        override fun fixture(): String = """
            CREATE (trait1:OcCharacterTrait:OcEthnicity {
              id: 'trait#1',
              label: 'Trait 1'
            })
            
            CREATE (trait2:OcEthnicity:OcCharacterTrait {
              id: 'trait#2',
              label: 'Trait 2'
            })
            
            CREATE (trait3:OcCharacterTrait:OcBodyType {
              id: 'trait#3',
              label: 'Trait 3'
            })
            
            CREATE (character1:OcCharacter {id: 'character#1'})
            CREATE (character1)-[:HAS_TRAIT]->(trait1)
            
            CREATE (character2:OcCharacter {id: 'character#2'})
            CREATE (character2)-[:HAS_TRAIT]->(trait2)
            
            CREATE (character3:OcCharacter {id: 'character#3'})
            CREATE (character3)-[:HAS_TRAIT]->(trait1)
            CREATE (character3)-[:HAS_TRAIT]->(trait3)
        """

    }
}
