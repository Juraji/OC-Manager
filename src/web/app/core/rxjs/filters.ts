import {concatMap, filter, from, map, MonoTypeOperatorFunction, ObservableInput, OperatorFunction, pipe} from 'rxjs';

import {once} from './limiters'

export const filterNotNull: <T>() => OperatorFunction<T, NonNullable<T>> = <T>() => pipe(
  filter(v => !(v === null || v === undefined)) as OperatorFunction<T, NonNullable<T>>
)

export const filterNotEmpty: <T extends { length: number }>() => MonoTypeOperatorFunction<T> = () => pipe(
  filter(arr => arr.length > 0)
)

export const filterAsync: <T>(predicate: (next: T) => ObservableInput<boolean>) => MonoTypeOperatorFunction<T> = predicate => {
  return pipe(
    concatMap(next => from(predicate(next)).pipe(once(), map(isTruthy => ({isTruthy, next})))),
    filter(({isTruthy}) => isTruthy),
    map(({next}) => next)
  )
}
