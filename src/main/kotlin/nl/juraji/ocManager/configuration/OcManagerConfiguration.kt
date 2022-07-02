package nl.juraji.ocManager.configuration

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import java.nio.file.Path

@ConstructorBinding
@ConfigurationProperties("oc.configuration")
data class OcManagerConfiguration(
    val dataDir: Path,
    val thumbnailSize: Int,
) {
    val thumbnailDir: Path
        get() = dataDir
            .resolve("thumbnails")
}
