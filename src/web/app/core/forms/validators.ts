import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export const required: (control: AbstractControl) => (ValidationErrors | null) =
  // We need to check for strictly NaN
  // eslint-disable-next-line use-isnan
  Validators.compose([Validators.required, c => c.value === Number.NaN ? {required: true} : null]) as ValidatorFn

const BLANKS_PATTERN = /^\s+$/
export const notBlank: (control: AbstractControl) => (ValidationErrors | null) = control =>
  control.value !== '' && BLANKS_PATTERN.test(control.value)
    ? {required: true}
    : null

export const requiredIf: (sourceField: string, matchExactValue?: unknown) => ValidatorFn = (f, m) => control => {
  const sourceControl = (control.root as FormGroup).get(f);
  return (!!sourceControl && (m !== undefined ? sourceControl.value === m : !!required(sourceControl))) ? required(control) : null
}
