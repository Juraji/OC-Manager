package nl.juraji.ocManager.domain.application

import com.fasterxml.jackson.annotation.JsonIgnore
import nl.juraji.ocManager.util.validators.RequiredIfFieldValue
import nl.juraji.ocManager.util.persistence.SingletonEntityIdGenerator
import org.springframework.data.annotation.Id
import org.springframework.data.neo4j.core.schema.GeneratedValue
import org.springframework.data.neo4j.core.schema.Node
import java.time.Instant

@Node
@RequiredIfFieldValue(
    sourceFieldName = "useFixedDate",
    sourceFieldValue = RequiredIfFieldValue.BOOL_TRUE,
    targetFieldName = "eventReferenceDate"
)
data class OcSettings(
    @Id @GeneratedValue(SingletonEntityIdGenerator::class)
    val id: String? = null,
    val useFixedDate: Boolean = false,
    val eventReferenceDate: Instant? = null,

    @JsonIgnore // Used internally
    val defaultTraitsInitialized: Boolean = false
)
