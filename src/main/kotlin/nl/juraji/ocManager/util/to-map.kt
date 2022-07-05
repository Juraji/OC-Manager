package nl.juraji.ocManager.util

import kotlin.reflect.KClass
import kotlin.reflect.KProperty1
import kotlin.reflect.full.memberProperties

@Suppress("UNCHECKED_CAST")
private fun <T : Any> toMapImpl(obj: T, excludeKeys: Array<out String>, stringifyEnums: Boolean): Map<String, Any?> {
    val properties: Collection<KProperty1<T, *>> =
        (obj::class as KClass<T>)
            .memberProperties
            .run {
                if (excludeKeys.isEmpty()) this
                else filter { !excludeKeys.contains(it.name) }
            }

    return properties.associate { prop ->
        prop.name to prop.get(obj)
            ?.let { if (stringifyEnums && it is Enum<*>) it.name else it }
            ?.let { value ->
                if (value::class.isData) toMapImpl(value, excludeKeys, stringifyEnums)
                else value
            }
    }
}

fun <T : Any> T.toMap(vararg excludeKeys: String, stringifyEnums: Boolean = false): Map<String, Any?> =
    toMapImpl(this, excludeKeys, stringifyEnums)

