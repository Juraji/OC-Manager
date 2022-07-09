package nl.juraji.ocManager.util

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.reflect.KClass

abstract class LoggerCompanion(subjectClass: KClass<*>) {
    protected val logger: Logger = logger(subjectClass)

    companion object {
        fun logger(subjectClass: KClass<*>): Logger =
            LoggerFactory.getLogger(subjectClass.java)
    }
}
