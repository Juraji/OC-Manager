package nl.juraji.ocManager.util

import kotlin.reflect.KClass
import kotlin.reflect.full.memberProperties

@Suppress("UNCHECKED_CAST")
private fun <T : Any> toMapImpl(obj: T): Map<String, Any?> =
    (obj::class as KClass<T>).memberProperties.associate { prop ->
        prop.name to prop.get(obj)?.let { value ->
            if (value::class.isData) toMapImpl(value)
            else value
        }
    }

fun <T : Any> T.toMap(): Map<String, Any?> = toMapImpl(this)

