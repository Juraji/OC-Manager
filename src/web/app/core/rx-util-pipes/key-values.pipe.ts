import {Pipe, PipeTransform} from '@angular/core';

import {SortFn} from '#core/arrays'

interface KeyValue<T, K extends keyof T> {
  key: K,
  value: T[K]
}

@Pipe({name: 'keyValues'})
export class KeyValuesPipe implements PipeTransform {

  transform<T, K extends keyof T>(value: Nullable<T>, keySortFn: SortFn<K> = () => 0): KeyValue<T, K>[] {
    if (!value) return []
    return (Object.keys(value) as K[])
      .sort(keySortFn)
      .map(k => ({key: k, value: value[k]}))
  }

}
