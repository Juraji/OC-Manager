import {KeyValue} from '@angular/common'

export const recordToKeyValues = <K extends string | number | symbol, V>(record: Record<K, V>): KeyValue<K, V>[] =>
  (Object.keys(record) as K[]).map(key => ({key, value: record[key]}))

export const keyValuesToRecord = <K extends string | number | symbol, V>(keyValues: KeyValue<K, V>[]): Record<K, V> =>
  keyValues.reduce((acc, next) => ({...acc, [next.key]: next.value}), {} as Record<K, V>)
