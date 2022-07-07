package nl.juraji.ocManager.configuration

import org.springframework.beans.factory.InitializingBean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import java.awt.Desktop
import java.net.URI

@Configuration
@Profile("!development & !test")
class UiRunnerConfiguration : InitializingBean {

    override fun afterPropertiesSet() {
        if (Desktop.isDesktopSupported())
            Desktop.getDesktop().browse(URI.create("http://localhost:8080/"))
    }
}
