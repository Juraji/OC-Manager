package nl.juraji.ocManager.api

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.verify
import nl.juraji.ocManager.configuration.BaseControllerTest
import nl.juraji.ocManager.domain.CharacterService
import nl.juraji.ocManager.domain.CharacterThumbnailService
import nl.juraji.ocManager.domain.characters.OcCharacter
import nl.juraji.ocManager.domain.characters.mockOcCharacter
import nl.juraji.ocManager.util.*
import org.junit.jupiter.api.Test
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.MediaType
import org.springframework.http.client.MultipartBodyBuilder
import org.springframework.test.web.reactive.server.expectBody
import org.springframework.test.web.reactive.server.expectBodyList
import org.springframework.web.reactive.function.BodyInserters
import java.time.Instant
import java.util.concurrent.ThreadLocalRandom

@WebFluxTest(CharacterController::class)
internal class CharacterControllerTest : BaseControllerTest() {

    @MockkBean
    private lateinit var characterService: CharacterService

    @MockkBean
    private lateinit var thumbnailService: CharacterThumbnailService

    @Test
    fun `should get all characters`() {
        val characters = listOf(
            mockOcCharacter(),
            mockOcCharacter(),
            mockOcCharacter(),
        )

        val expected = characters
            .map { it.copy(thumbnail = null) }

        every { characterService.getAllCharacters() } returnsFluxOf characters

        webTestClient.get()
            .uri("/characters")
            .exchange()
            .expectStatus().isOk
            .expectBodyList<OcCharacter>()
            .contains(*expected.toTypedArray())

        verify { characterService.getAllCharacters() }
    }

    @Test
    fun `should get character by id`() {
        val character = mockOcCharacter()
        val characterId = character.id!!
        val expected = character.copy(thumbnail = null)

        every { characterService.getCharacterById(any()) } returnsMonoOf character

        webTestClient.get()
            .uri("/characters/$characterId")
            .exchange()
            .expectStatus().isOk
            .expectBody<OcCharacter>()
            .isEqualTo(expected)

        verify { characterService.getCharacterById(characterId) }
    }

    @Test
    fun `should create character`() {
        val input = OcCharacter(
            name = "New character",
            nickname = "Test C",
            dateOfBirth = Instant.now()
        )

        val expected = input.copy(id = uuid())

        every { characterService.createCharacter(any()) } returnsMonoOf expected

        webTestClient.post()
            .uri("/characters")
            .bodyValue(input)
            .exchange()
            .expectStatus().isOk
            .expectBody<OcCharacter>()
            .isEqualTo(expected)

        verify { characterService.createCharacter(input) }
    }

    @Test
    fun `should update character`() {
        val existing = mockOcCharacter()
        val characterId = existing.id!!
        val input = existing.copy(name = "Something else")
        val expected = existing.copy(
            name = "Something else",
            thumbnail = null
        )

        every { characterService.updateCharacter(any(), any()) } returnsArgumentAsMono 1

        webTestClient.put()
            .uri("/characters/$characterId")
            .bodyValue(input)
            .exchange()
            .expectStatus().isOk
            .expectBody<OcCharacter>()
            .isEqualTo(expected)

        verify { characterService.updateCharacter(characterId, expected) }
    }

    @Test
    fun `should delete character`() {
        val characterId = uuid()

        every { characterService.deleteCharacter(any()) }.returnsEmptyMono()

        webTestClient.delete()
            .uri("/characters/$characterId")
            .exchange()
            .expectStatus().isOk

        verify { characterService.deleteCharacter(characterId) }
    }

    @Test
    fun `should get character thumbnail`() {
        val characterId = uuid()
        val expected = ByteArray(1024)
            .apply {
                val random = ThreadLocalRandom.current()
                random.nextBytes(this)
            }

        every { thumbnailService.getCharacterThumbnail(any()) } returnsMonoOf ByteArrayResource(expected)

        webTestClient.get()
            .uri("/characters/$characterId/thumbnail")
            .exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_OCTET_STREAM)
            .expectBody<ByteArray>()
            .isEqualTo(expected)

        verify { thumbnailService.getCharacterThumbnail(characterId) }
    }

    @Test
    fun `should create character thumbnail`() {
        val expected = mockOcCharacter().copy(thumbnail = null)
        val characterId = expected.id!!
        val inputBytes = ByteArray(1024)
            .apply {
                val random = ThreadLocalRandom.current()
                random.nextBytes(this)
            }

        val body = MultipartBodyBuilder()
            .apply {
                val byteResource = object : ByteArrayResource(inputBytes) {
                    override fun getFilename(): String = "filename.jpg"
                }

                part("thumbnail", byteResource, MediaType.IMAGE_JPEG)
            }
            .build()

        every { thumbnailService.createCharacterThumbnail(any(), any()) } returnsMonoOf expected

        webTestClient.post()
            .uri("/characters/$characterId/thumbnail")
            .body(BodyInserters.fromMultipartData(body))
            .exchange()
            .expectStatus().isOk
            .expectBody<OcCharacter>()
            .isEqualTo(expected)

        verify { thumbnailService.createCharacterThumbnail(characterId, any()) }
    }
}
