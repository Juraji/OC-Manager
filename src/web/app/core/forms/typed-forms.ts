import {AbstractControl, FormArray, FormControl, FormControlStatus, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';

export interface TypedAbstractControl<T> extends AbstractControl {
  readonly value: T;
  readonly valueChanges: Observable<T>;
  readonly status: FormControlStatus;
  readonly statusChanges: Observable<FormControlStatus>;

  get<V = unknown>(path: (string | number)[] | string): TypedAbstractControl<V> | null;

  setValue<V>(value: V extends T ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  patchValue<V>(value: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  reset<V>(value?: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

export interface TypedFormControl<T> extends FormControl, TypedAbstractControl<T> {
  readonly value: T;
  readonly valueChanges: Observable<T>;
  readonly status: FormControlStatus;
  readonly statusChanges: Observable<FormControlStatus>;

  get<V = unknown>(path: (string | number)[] | string): TypedAbstractControl<V> | null;

  setValue<V>(value: V extends T ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  patchValue<V>(value: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  reset<V>(value?: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

export interface TypedFormGroup<T> extends FormGroup, TypedAbstractControl<T> {
  readonly controls: { [P in keyof T]: TypedAbstractControl<T[P]> };

  readonly value: T;
  readonly valueChanges: Observable<T>;
  readonly status: FormControlStatus;
  readonly statusChanges: Observable<FormControlStatus>;

  registerControl<P extends keyof T>(name: P, control: TypedAbstractControl<T[P]>): TypedAbstractControl<T[P]>;

  registerControl<V = unknown>(name: string, control: TypedAbstractControl<V>): TypedAbstractControl<V>;

  addControl<P extends keyof T>(name: P, control: TypedAbstractControl<T[P]>): void;

  addControl<V = unknown>(name: string, control: TypedAbstractControl<V>): void;

  removeControl(name: keyof T): void;

  removeControl(name: string): void;

  setControl<P extends keyof T>(name: P, control: TypedAbstractControl<T[P]>): void;

  setControl<V = unknown>(name: string, control: TypedAbstractControl<V>): void;

  contains(name: keyof T): boolean;

  contains(name: string): boolean;

  get<P extends keyof T>(path: P): TypedAbstractControl<T[P]>;

  get<V = unknown>(path: (string | number)[] | string): TypedAbstractControl<V> | null;

  getRawValue(): T & { [disabledProp in string | number]: unknown };

  setValue<V>(value: V extends T ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  patchValue<V>(value: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  reset<V>(value?: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

export interface TypedFormArray<T> extends FormArray, TypedAbstractControl<T[]> {
  readonly controls: TypedAbstractControl<T>[];
  readonly value: T[];
  readonly valueChanges: Observable<T[]>;
  readonly status: FormControlStatus;
  readonly statusChanges: Observable<FormControlStatus>;

  at(index: number): TypedAbstractControl<T>;

  push<V = T>(ctrl: TypedAbstractControl<V>): void;

  insert<V = T>(index: number, control: TypedAbstractControl<V>): void;

  setControl<V = T>(index: number, control: TypedAbstractControl<V>): void;

  getRawValue(): T[];

  get<V = unknown>(path: (string | number)[] | string): TypedAbstractControl<V> | null;

  setValue<V>(value: V extends T[] ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  patchValue<V>(value: V extends (Partial<T> | undefined)[] ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;

  reset<V>(value?: V extends (Partial<T> | undefined)[] ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}
