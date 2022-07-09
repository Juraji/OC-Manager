package nl.juraji.ocManager.configuration

import nl.juraji.ocManager.util.LoggerCompanion
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.annotation.Profile
import org.springframework.context.event.EventListener
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component
import java.awt.Desktop
import java.net.InetAddress
import java.net.URI


@Component
@Profile("!development & !test")
class UiRunner(
    private val environment: Environment
) {

    @Suppress("HttpUrlsUsage")
    @EventListener(ApplicationReadyEvent::class)
    fun applicationReadyEvent(e: ApplicationReadyEvent) {
        val logger = LoggerCompanion.logger(UiRunner::class)
        val port = environment.getProperty("local.server.port")
        val host = InetAddress.getLocalHost().hostAddress
        val uiAddress = "http://$host:$port"
        logger.info("Browsing to $uiAddress...")

        if (Desktop.isDesktopSupported()) {
            Desktop.getDesktop()
                .runCatching { browse(URI.create(uiAddress)) }
                .onFailure { logger.error("Failed browsing to $uiAddress using AWT Desktop", it) }
        } else {
            Runtime.getRuntime()
                .runCatching { exec("rundll32 url.dll,FileProtocolHandler $uiAddress") }
                .onFailure { logger.error("Failed browsing to $uiAddress using file protocol handler", it) }
        }
    }
}
