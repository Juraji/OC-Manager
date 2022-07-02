package nl.juraji.ocManager.configuration

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Import
import org.springframework.test.web.reactive.server.WebTestClient

@Import(JacksonObjectMapperConfiguration::class)
abstract class BaseControllerTest {

    @Autowired
    protected lateinit var webTestClient: WebTestClient
}
