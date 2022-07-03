import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

class ObservableInput<T> {
  constructor(
    private readonly _subject: Subject<T>,
    private readonly _value: () => T
  ) {}

  onChanges() {
    this._subject.next(this._value());
  }
}

export class ObservableInputs {
  private readonly inputs: ObservableInput<unknown>[] = [];

  onChanges() {
    for (const input of this.inputs) {
      input.onChanges();
    }
  }

  observe<T>(value: () => T): Observable<T> {
    const subject = new ReplaySubject<T>(1);
    this.inputs.push(new ObservableInput(subject, value) as ObservableInput<unknown>);
    return subject.pipe(distinctUntilChanged());
  }
}
