type SortFn<T> = (a: T, b: T) => number

const mappedSort = <T, R>(mapper: (o: T) => R, sortFn: SortFn<R>): SortFn<T> =>
  (a, b) => sortFn(mapper(a), mapper(b))

export const chainSort = <T>(...sorts: SortFn<T>[]): SortFn<T> =>
  (a, b) => sorts.reduce((acc, next) => acc || next(a, b), 0)

export const orderedSort = <T, R>(mapper: (o: T) => R, ...order: R[]): SortFn<T> =>
  mappedSort(mapper, (a, b) => {
    if (a === b) return 0

    const idxOfA = order.indexOf(a)
    const idxOfB = order.indexOf(b)

    if (idxOfA === idxOfB) return 0;
    else if (idxOfA === -1) return 1;
    else if (idxOfB === -1) return -1;
    else return idxOfA - idxOfB
  });

export const booleanSort = <T>(mapper: (o: T) => boolean, desc = false): SortFn<T> =>
  orderedSort(mapper, !desc, desc)

const intlCollatorOpts: Intl.CollatorOptions = {numeric: true, sensitivity: 'base'};
export const strSort = <T>(mapper: (o: T) => string | null | undefined, desc = false): SortFn<T> =>
  mappedSort(mapper, (a, b) => desc
    ? b?.localeCompare(a as string, undefined, intlCollatorOpts) ?? 1
    : a?.localeCompare(b as string, undefined, intlCollatorOpts) ?? 1);

export const numberSort = <T>(mapper: (o: T) => number, desc = false): SortFn<T> =>
  mappedSort(mapper, (a, b) => desc ? b - a : a - b);

export const ifSort = <T, K extends keyof T, V extends T[K]>(key: K, equalsTo: V, sortFn: SortFn<T>): SortFn<T> => (a, b) =>
  a == b ? 0 : a[key] === equalsTo && b[key] === equalsTo ? sortFn(a, b) : 0
