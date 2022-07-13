package nl.juraji.ocManager.util

import org.neo4j.driver.types.MapAccessor
import java.time.Instant
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.full.isSubclassOf
import kotlin.reflect.full.isSuperclassOf
import kotlin.reflect.full.primaryConstructor

class Neo4jDataClassMapper<T : Any>(
    private val baseClass: KClass<out T>,
    private val instantInSeconds: Boolean = true
) {
    private val nonNativeTypes: Set<KClass<*>> = buildNonNativeTypesList(baseClass)

    fun mapFrom(fetchResult: Map<String, Any>): T =
        mapFromInternal(fetchResult, baseClass)

    @Suppress("UNCHECKED_CAST")
    private fun <R : Any> mapFromInternal(mapProjection: Map<String, Any>, resultType: KClass<out R>): R {
        val primaryConstructor: KFunction<R> = resultType.primaryConstructor!!

        val parameters = primaryConstructor.parameters
            .associate { kParameter ->
                val paramCls = kParameter.type.classifier as KClass<out Any>
                val value = mapProjection[kParameter.name]

                when {
                    value == null -> kParameter to when {
                        kParameter.isOptional -> OMIT_PARAMETER_VALUE
                        kParameter.type.isMarkedNullable -> null
                        else -> throw CanNotMapNullException(kParameter.name)
                    }
                    paramCls.isInstance(value) -> kParameter to value
                    isEnum(paramCls) && value is String ->
                        kParameter to getEnumValue(kParameter.name!!, paramCls, value)
                    Number::class.isSuperclassOf(paramCls) && value is Number -> kParameter to value.toInt()
                    Instant::class.isSuperclassOf(paramCls) && value is Number ->
                        if (instantInSeconds) kParameter to Instant.ofEpochSecond(value.toLong())
                        else kParameter to Instant.ofEpochMilli(value.toLong())
                    nonNativeTypes.contains(paramCls) -> {
                        val subMap = when (value) {
                            is MapAccessor -> value.asMap()
                            is Map<*, *> -> value as Map<String, Any>
                            else -> throw CanNotMapValueException(kParameter.name!!, value, paramCls)
                        }
                        kParameter to mapFromInternal(subMap, paramCls)
                    }
                    else -> throw CanNotMapValueException(kParameter.name!!, value, paramCls)
                }
            }
            .filter { (_, value) -> value != OMIT_PARAMETER_VALUE }

        return primaryConstructor.callBy(parameters)
    }

    private fun isEnum(cls: KClass<*>): Boolean = cls.isSubclassOf(Enum::class)

    private fun getEnumValue(paramName: String, cls: KClass<*>, enumValue: String): Any =
        cls.java.enumConstants.filterIsInstance(Enum::class.java).firstOrNull { it.name == enumValue.uppercase() }
            ?: throw CanNotMapValueException(paramName, enumValue, cls)

    private fun buildNonNativeTypesList(cls: KClass<out Any>): Set<KClass<*>> {
        if (!cls.isData) throw IllegalArgumentException("${cls.qualifiedName} is not a data class")
        val selfConstructor = cls.primaryConstructor!!
        val childAllowedTypes = selfConstructor.parameters
            .map { it.type.classifier as KClass<out Any> }
            .filter { it.isData }
            .flatMap { buildNonNativeTypesList(it) }
            .toSet()

        return childAllowedTypes + cls
    }

    companion object {
        private const val OMIT_PARAMETER_VALUE = "__OMIT_PARAMETER_VALUE__"
    }

    class CanNotMapValueException(paramName: String, value: Any, targetType: KClass<out Any>) :
        Exception("Can not map value [$value] to parameter of type ${targetType.qualifiedName} for $paramName")

    class CanNotMapNullException(paramName: String? = "unknown") :
        Exception("Value for parameter $paramName is null, but the parameter is not nullable or optional")
}
