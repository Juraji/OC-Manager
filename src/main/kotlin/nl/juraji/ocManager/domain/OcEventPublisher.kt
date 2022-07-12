package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.applicationEvents.OcEvent
import nl.juraji.ocManager.util.LoggerCompanion
import org.springframework.stereotype.Service
import reactor.core.CorePublisher
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.Sinks
import javax.annotation.PreDestroy
import kotlin.reflect.KClass

@Service
class OcEventPublisher {
    private val sink: Sinks.Many<OcEvent> = Sinks.many().replay().latest()

    fun publish(event: OcEvent) {
        sink.tryEmitNext(event)
    }

    @Suppress("UNCHECKED_CAST") // Filter checks this
    fun <T : OcEvent> listenTo(ocEventCls: KClass<out T>): Flux<T> =
        this.sink.asFlux().filter(ocEventCls::isInstance) as Flux<T>

    fun <T : OcEvent> listenTo(ocEventCls: KClass<out T>, pipe: (event: Mono<T>) -> CorePublisher<*>) {
        this.listenTo(ocEventCls)
            .flatMap { Mono.just(it).let(pipe) }
            .onErrorContinue { t, _ -> logger.error("Error during handling of OcEvent", t) }
            .subscribe()
    }

    @PreDestroy
    fun destroy() {
        sink.tryEmitComplete()
    }

    companion object: LoggerCompanion(OcEventPublisher::class)
}
