import {BehaviorSubject} from 'rxjs'

export class BooleanBehaviourSubject extends BehaviorSubject<boolean> {

  public constructor(private readonly defaultValue = false) {
    super(defaultValue)
  }

  public toggle() {
    this.next(!this.value)
  }

  public setTrue() {
    if (!this.value) this.next(true)
  }

  public setFalse() {
    if (this.value) this.next(false)
  }

  public reset() {
    this.next(this.defaultValue)
  }
}
