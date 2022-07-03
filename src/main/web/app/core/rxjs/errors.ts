import {catchError, EMPTY, MonoTypeOperatorFunction, OperatorFunction, pipe} from 'rxjs'

export const catchToNull = <T>(): OperatorFunction<T, T | null> => pipe(
  catchError(() => [null])
)

export const catchToEmpty = <T>(): MonoTypeOperatorFunction<T> => pipe(
  catchError(() => EMPTY)
)

export const catchToEmptyArray = <T>(): MonoTypeOperatorFunction<T[]> => pipe(
  catchError(() => [[]])
)
