package nl.juraji.ocManager

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@SpringBootApplication
@ConfigurationPropertiesScan("nl.juraji.ocManager.configuration")
class OcManagerApplication

fun main(args: Array<String>) {
    runApplication<OcManagerApplication>(*args)
}
