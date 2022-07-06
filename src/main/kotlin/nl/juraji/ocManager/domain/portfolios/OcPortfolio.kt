package nl.juraji.ocManager.domain.portfolios

import com.fasterxml.jackson.annotation.JsonProperty
import nl.juraji.ocManager.util.persistence.StringUUIDGenerator
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Id
import org.springframework.data.neo4j.core.schema.Node
import javax.validation.constraints.NotBlank

@Node
data class OcPortfolio(
    @Id @GeneratedValue(StringUUIDGenerator::class)
    val id: String? = null,
    @NotBlank
    val name: String,
    val description: String,
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    val default: Boolean = false
)
