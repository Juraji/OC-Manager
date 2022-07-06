import {ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges} from '@angular/core';

import {BooleanInput} from '#core/ng-extensions'

@Component({
  selector: 'ocm-read-only-field',
  templateUrl: './read-only-field.component.html',
  styleUrls: ['./read-only-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadOnlyFieldComponent implements OnChanges {

  @Input()
  label: Nullable<string>

  @Input()
  value: Nullable<unknown>

  @Input()
  prefix: Nullable<string>

  @Input()
  suffix: Nullable<string>

  @Input()
  @BooleanInput()
  hideWhenEmpty: boolean | string = true;

  @Input()
  placeholder: Nullable<string>;

  @HostBinding('class.hidden')
  hidden = false;

  @HostBinding('class.mb-3')
  readonly hostClasses = true

  constructor() {
  }

  ngOnChanges() {
    this.hidden = !this.value && !!this.hideWhenEmpty
    console.log(this.hidden)
  }

}
