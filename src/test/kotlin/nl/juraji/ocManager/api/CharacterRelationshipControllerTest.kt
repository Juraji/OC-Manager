package nl.juraji.ocManager.api

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.verify
import nl.juraji.ocManager.configuration.BaseControllerTest
import nl.juraji.ocManager.domain.CharacterRelationshipService
import nl.juraji.ocManager.domain.characters.OcCharacterRelationship
import nl.juraji.ocManager.domain.characters.OcCharacterRelationshipType
import nl.juraji.ocManager.domain.characters.mockOcCharacterRelationship
import nl.juraji.ocManager.util.returnsEmptyMono
import nl.juraji.ocManager.util.returnsFluxOf
import nl.juraji.ocManager.util.returnsMonoOf
import nl.juraji.ocManager.util.uuid
import org.junit.jupiter.api.Test

import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.test.web.reactive.server.expectBody
import org.springframework.test.web.reactive.server.expectBodyList

@WebFluxTest(CharacterRelationshipController::class)
internal class CharacterRelationshipControllerTest : BaseControllerTest() {

    @MockkBean
    private lateinit var relationshipService: CharacterRelationshipService

    @Test
    fun `should get all by character id`() {
        val characterId = uuid()
        val expected = listOf(
            mockOcCharacterRelationship(),
            mockOcCharacterRelationship(),
            mockOcCharacterRelationship(),
        )

        every { relationshipService.getAllByCharacterId(any()) } returnsFluxOf expected

        webTestClient.get()
            .uri("/characters/$characterId/relationships")
            .exchange()
            .expectStatus().isOk
            .expectBodyList<OcCharacterRelationship>()
            .contains(*expected.toTypedArray())

        verify { relationshipService.getAllByCharacterId(characterId) }
    }

    @Test
    fun `should create relationship`() {
        val sourceCharacterId = uuid()
        val targetCharacterId = uuid()
        val type = OcCharacterRelationshipType.FRIENDSHIP
        val description = "Some description"

        val expected = OcCharacterRelationship(
            id = uuid(),
            type = type,
            description = description,
            sourceCharacterId = sourceCharacterId,
            targetCharacterId = targetCharacterId
        )

        every { relationshipService.createRelationship(any(), any(), any(), any()) } returnsMonoOf expected

        webTestClient.post()
            .uri { builder ->
                builder
                    .path("/characters/$sourceCharacterId/relationships")
                    .queryParam("type", type.name)
                    .queryParam("description", description)
                    .queryParam("targetCharacterId", targetCharacterId)
                    .build()
            }
            .exchange()
            .expectStatus().isOk
            .expectBody<OcCharacterRelationship>()
            .isEqualTo(expected)

        verify { relationshipService.createRelationship(sourceCharacterId, targetCharacterId, type, description) }
    }

    @Test
    fun `should update relationship`() {
        val characterId = uuid()
        val existing = mockOcCharacterRelationship()
        val relationshipId = existing.id!!
        val newType = OcCharacterRelationshipType.ROMANTIC
        val expected = existing.copy(type = newType)

        every { relationshipService.updateRelationship(any(), any()) } returnsMonoOf expected

        webTestClient.put()
            .uri { builder ->
                builder
                    .path("/characters/$characterId/relationships/$relationshipId")
                    .queryParam("type", newType.name)
                    .build()
            }
            .exchange()
            .expectStatus().isOk
            .expectBody<OcCharacterRelationship>()
            .isEqualTo(expected)

        verify { relationshipService.updateRelationship(relationshipId, type = newType) }
    }

    @Test
    fun `should delete relationship`() {
        val characterId = uuid()
        val relationshipId = uuid()

        every { relationshipService.deleteRelationship(any()) }.returnsEmptyMono()

        webTestClient.delete()
            .uri("/characters/$characterId/relationships/$relationshipId")
            .exchange()
            .expectStatus().isOk

        verify { relationshipService.deleteRelationship(relationshipId) }
    }
}
