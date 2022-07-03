import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormControlOptions,
  FormGroup,
  ValidatorFn
} from '@angular/forms';

import {TypedAbstractControl, TypedFormArray, TypedFormControl, TypedFormGroup} from './typed-forms';

export function typedFormControl<T>(
  state: T | { value: T, disabled: boolean },
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): TypedFormControl<T> {
  return new FormControl(state, validatorOrOpts, asyncValidator) as TypedFormControl<T>;
}

export function typedFormGroup<T>(
  controls: { [P in keyof T]: TypedAbstractControl<T[P]> },
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): TypedFormGroup<T> {
  return new FormGroup(controls, validatorOrOpts, asyncValidator) as TypedFormGroup<T>;
}

export function typedFormArray<T>(
  controls: TypedAbstractControl<T>[],
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): TypedFormArray<T> {
  return new FormArray(controls, validatorOrOpts, asyncValidator) as TypedFormArray<T>
}
