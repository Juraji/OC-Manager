package nl.juraji.ocManager.util

import org.reactivestreams.Publisher
import reactor.test.StepVerifier

fun <T> Publisher<T>.stepVerifier() = StepVerifier.create(this)
