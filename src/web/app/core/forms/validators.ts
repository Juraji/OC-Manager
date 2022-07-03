import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

/** ng form validator shortcuts */
export const required: (control: AbstractControl) => (ValidationErrors | null) =
  Validators.compose([Validators.required, c => isNaN(c.value) ? {required: true} : null]) as ValidatorFn

/** Custom validators */
const BLANKS_PATTERN = /^\s+$/
export const requiredNotBlank: (control: AbstractControl) => (ValidationErrors | null) = control =>
  (!control.value && control.value !== 0) || BLANKS_PATTERN.test(control.value)
    ? {required: true}
    : null


