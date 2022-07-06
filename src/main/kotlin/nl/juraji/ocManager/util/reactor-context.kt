package nl.juraji.ocManager.util

import reactor.core.publisher.Mono
import reactor.util.context.ContextView

fun <T : Any, R : Any> Mono<T>.flatMapContextual(map: ContextView.(t: T) -> Mono<R>) =
    this.transformDeferredContextual { t, u -> t.flatMap { map.invoke(u, it) } }
