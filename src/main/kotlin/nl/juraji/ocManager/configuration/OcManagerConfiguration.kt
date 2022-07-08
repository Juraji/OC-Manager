package nl.juraji.ocManager.configuration

import org.springframework.beans.factory.InitializingBean
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import java.nio.file.Files
import java.nio.file.Path
import kotlin.io.path.absolute

@ConstructorBinding
@ConfigurationProperties("oc.configuration")
data class OcManagerConfiguration(
    val dataDir: Path,
    val thumbnailSize: Int,
    val thumbnailType: String,
) : InitializingBean {
    val imagesDir: Path by lazy {
        dataDir.resolve("images").absolute()
    }

    override fun afterPropertiesSet() {
        Files.createDirectories(dataDir)
        Files.createDirectories(imagesDir)
    }
}
