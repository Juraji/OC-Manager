package nl.juraji.ocManager.domain

import com.fasterxml.jackson.databind.ObjectMapper
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.io.ByteArrayOutputStream
import java.io.OutputStreamWriter

@Service
class CharacterExportService(
    private val characterService: CharacterService,
    private val characterTraitService: CharacterTraitService,
    private val objectMapper: ObjectMapper,
) {

    fun exportCharacters(): Mono<Resource> = characterService
        .getAllCharacters()
        .flatMap { c ->
            characterTraitService
                .getAllCharacterTraits(c.id!!)
                .collectList()
                .map { c to it }
        }
        .map { (char, traits) ->
            listOf(
                char.name,
                char.nickname,
                char.dateOfBirth.toString(),
                char.notes,
                objectMapper.writeValueAsString(traits)
            )
        }
        .collectList()
        .map { records ->
            val bos = ByteArrayOutputStream()
            val output = OutputStreamWriter(bos, Charsets.UTF_8)
            val fmt = CSVFormat.Builder.create(CSVFormat.DEFAULT)
                .setHeader("Name", "Nickname", "Date of birth", "Notes", "Traits")
                .build()

            CSVPrinter(output, fmt).use { p ->
                records.forEach { l -> p.printRecord(l) }
            }

            ByteArrayResource(bos.toByteArray(), "character-export.csv")
        }
}
