import {MonoTypeOperatorFunction, pipe, take} from 'rxjs'

export const once: <T>() => MonoTypeOperatorFunction<T> = () => pipe(take(1))
