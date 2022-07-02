package nl.juraji.ocManager.api

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.verify
import nl.juraji.ocManager.configuration.BaseControllerTest
import nl.juraji.ocManager.domain.CharacterTraitService
import nl.juraji.ocManager.domain.traits.*
import nl.juraji.ocManager.util.returnsEmptyMono
import nl.juraji.ocManager.util.returnsFluxOf
import nl.juraji.ocManager.util.returnsMonoOf
import nl.juraji.ocManager.util.uuid
import org.junit.jupiter.api.Test
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.test.web.reactive.server.expectBody

@WebFluxTest(CharacterTraitController::class)
internal class CharacterTraitControllerTest : BaseControllerTest() {

    @MockkBean
    private lateinit var characterTraitService: CharacterTraitService

    @Test
    fun `should get all character traits`() {
        val characterId = uuid()
        val expected = listOf(
            mockOcBodyType(),
            mockOcEthnicity(),
            mockOcHairStyle(),
            mockOcGenderPreference(),
            mockOcEyeColor()
        )

        every { characterTraitService.getAllCharacterTraits(any()) } returnsFluxOf expected

        // Due to the polymorphic nature of OcCharacterTrait, Jackson is unable to deserialize the api output.
        // The api doesn't actually need to be able to deserialize these, so setting that up just for test is silly.
        webTestClient.get()
            .uri("/characters/$characterId/traits")
            .exchange()
            .expectStatus().isOk

        verify { characterTraitService.getAllCharacterTraits(characterId) }
    }

    @Test
    fun `should add trait to character`() {
        val characterId = uuid()
        val existingTrait = mockOcHairStyle()
        val traitId = existingTrait.id!!

        every { characterTraitService.addTraitToCharacter(any(), any()) } returnsMonoOf existingTrait

        webTestClient.post()
            .uri("/characters/$characterId/traits/$traitId")
            .exchange()
            .expectStatus().isOk
            .expectBody<OcHairStyle>()
            .isEqualTo(existingTrait)

        verify { characterTraitService.addTraitToCharacter(characterId, traitId) }
    }

    @Test
    fun `should remove trait from character`() {
        val characterId = uuid()
        val traitId = uuid()

        every { characterTraitService.removeTraitFromCharacter(any(), any()) }.returnsEmptyMono()

        webTestClient.delete()
            .uri("/characters/$characterId/traits/$traitId")
            .exchange()
            .expectStatus().isOk

        verify { characterTraitService.removeTraitFromCharacter(characterId, traitId) }
    }
}
