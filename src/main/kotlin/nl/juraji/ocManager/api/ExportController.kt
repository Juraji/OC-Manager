package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.CharacterExportService
import org.springframework.core.io.Resource
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/export")
class ExportController(
    private val characterExportService: CharacterExportService,
) {

    @GetMapping("/characters")
    fun exportCharacters(): Mono<Resource> =
        characterExportService.exportCharacters()
}
