import {coerceBooleanProperty} from '@angular/cdk/coercion';

/**
 * To be used on boolean type inputs.
 * Adds support for boolean inputs to be true when just setting the property name in HTML
 *
 * {@param nullOnFalse} is used for properties that should be non-existent if false, like "disabled".
 * (disabled="false" is still a truthy value, so it disabled the element)
 */
export function BooleanInput(nullOnFalse = false): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void => {
    const localKey: unique symbol = Symbol(`__boolean_input_${String(propertyKey)}__`);

    const infer = (v: unknown) => {
      const boolVal = coerceBooleanProperty(v);
      return nullOnFalse && !boolVal ? null : boolVal;
    }

    const setter = (v: unknown) => target[localKey] = infer(v)
    const getter = (): boolean => target[localKey]

    // Init symbol with default value
    setter(target[propertyKey])

    Object.defineProperty(target, propertyKey, {
      set: setter,
      get: getter,
      configurable: descriptor?.configurable,
      enumerable: descriptor?.enumerable,
    });
  }
}
