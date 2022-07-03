import {Observable, startWith} from 'rxjs';

import {TypedAbstractControl} from './typed-forms';

/**
 * AbstractControl.valueChanges only emits a value on user changes, missing the initial value.
 * This function creates an observable of the control value with replay initial.
 * @param control The control to listen to
 */
export const ofControlValue = <T>(control: TypedAbstractControl<T>): Observable<T> => {
  return control.valueChanges.pipe(startWith(control.value))
}
