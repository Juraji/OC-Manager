package nl.juraji.ocManager.util

import reactor.core.publisher.Mono
import reactor.util.context.ContextView

fun <T : Any, R : Any> Mono<T>.flatMapContextual(map: ContextView.(t: T) -> Mono<R>) =
    this.transformDeferredContextual { next, ctx -> next.flatMap { map.invoke(ctx, it) } }
