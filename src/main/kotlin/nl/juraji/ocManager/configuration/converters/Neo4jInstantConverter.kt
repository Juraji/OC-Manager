package nl.juraji.ocManager.configuration.converters

import org.neo4j.driver.Value
import org.neo4j.driver.Values
import org.springframework.core.convert.TypeDescriptor
import org.springframework.core.convert.converter.GenericConverter
import java.time.Instant

class Neo4jInstantConverter : GenericConverter {
    override fun getConvertibleTypes(): Set<GenericConverter.ConvertiblePair> = setOf(
        GenericConverter.ConvertiblePair(Instant::class.java, Value::class.java),
        GenericConverter.ConvertiblePair(Value::class.java, Instant::class.java),
    )

    override fun convert(source: Any?, sourceType: TypeDescriptor, targetType: TypeDescriptor): Any? = when (source) {
        is Instant -> Values.value(source.epochSecond)
        is Value -> Instant.ofEpochSecond(source.asLong())
        else -> null
    }
}
