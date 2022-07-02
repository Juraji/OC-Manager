package nl.juraji.ocManager.configuration.converters

import org.neo4j.driver.Value
import org.neo4j.driver.internal.value.StringValue
import org.springframework.core.convert.TypeDescriptor
import org.springframework.core.convert.converter.GenericConverter
import java.nio.file.Path

class Neo4jNioPathConverter : GenericConverter {
    override fun getConvertibleTypes(): Set<GenericConverter.ConvertiblePair> = setOf(
        GenericConverter.ConvertiblePair(Path::class.java, Value::class.java),
        GenericConverter.ConvertiblePair(Value::class.java, Path::class.java),
    )

    override fun convert(source: Any?, sourceType: TypeDescriptor, targetType: TypeDescriptor): Any? = when (source) {
        is Path -> StringValue(source.toString())
        is Value -> Path.of(source.asString())
        else -> null
    }
}
