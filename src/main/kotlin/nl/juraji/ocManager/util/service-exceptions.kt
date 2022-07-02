package nl.juraji.ocManager.util

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import kotlin.reflect.KClass

data class EntityNotFoundException(
    val entityName: String,
    val entityId: String
) : ResponseStatusException(HttpStatus.NOT_FOUND, "Entity of type $entityName(id = $entityId) with id not found") {
    constructor(entity: KClass<*>, entityId: String) : this(entity.simpleName!!, entityId)
}

data class RelationshipNotCreatedException(
    val leftEntityName: String,
    val leftEntityId: String,
    val rightEntityName: String,
    val rightEntityId: String
) : ResponseStatusException(
    HttpStatus.BAD_REQUEST,
    "Relationship could not be created between $leftEntityName(id = $leftEntityId) and $rightEntityName(id = $rightEntityName)"
) {
    constructor(
        leftEntity: KClass<*>,
        leftEntityId: String,
        rightEntity: KClass<*>,
        rightEntityId: String
    ) : this(leftEntity.simpleName!!, leftEntityId, rightEntity.simpleName!!, rightEntityId)
}

fun <T> Mono<T>.orElseEntityNotFound(entity: KClass<*>, entityId: String = "unknown") =
    this.switchIfEmpty {
        Mono.error(EntityNotFoundException(entity, entityId))
    }

fun <T> Mono<T>.orElseRelationshipNotCreated(
    leftEntity: KClass<*>,
    rightEntity: KClass<*>,
    leftEntityId: String = "unknown",
    rightEntityId: String = "unknown"
) = this.switchIfEmpty {
    Mono.error(RelationshipNotCreatedException(leftEntity, leftEntityId, rightEntity, rightEntityId))
}
