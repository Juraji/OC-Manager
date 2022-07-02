package nl.juraji.ocManager.util

import io.mockk.MockKAdditionalAnswerScope
import io.mockk.MockKStubScope
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Suppress("UNCHECKED_CAST")
infix fun <T : Any, B> MockKStubScope<Mono<T>, B>.returnsArgumentAsMono(n: Int): MockKAdditionalAnswerScope<Mono<T>, B> =
    this answers { Mono.just(invocation.args[n] as T) }

fun <T, B> MockKStubScope<Mono<T>, B>.returnsEmptyMono(): MockKAdditionalAnswerScope<Mono<T>, B> =
    this.returns(Mono.empty())

infix fun <T : Any, B> MockKStubScope<Mono<T>, B>.returnsMonoOf(value: T): MockKAdditionalAnswerScope<Mono<T>, B> =
    this.returns(Mono.just(value))

infix fun <T, B> MockKStubScope<Mono<T>, B>.returnsErrorMonoOf(t: () -> Throwable): MockKAdditionalAnswerScope<Mono<T>, B> =
    this.returns(Mono.error(t))

fun <T, B> MockKStubScope<Flux<T>, B>.returnsEmptyFlux(): MockKAdditionalAnswerScope<Flux<T>, B> =
    this.returns(Flux.empty())

infix fun <T, B> MockKStubScope<Flux<T>, B>.returnsFluxOf(iterable: Iterable<T>): MockKAdditionalAnswerScope<Flux<T>, B> =
    this.returns(Flux.fromIterable(iterable))

infix fun <T : Any, B> MockKStubScope<Flux<T>, B>.returnsFluxOf(singleItem: T): MockKAdditionalAnswerScope<Flux<T>, B> =
    this.returns(Flux.just(singleItem))
