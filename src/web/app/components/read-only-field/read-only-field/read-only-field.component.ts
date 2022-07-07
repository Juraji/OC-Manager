import {ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'ocm-read-only-field',
  templateUrl: './read-only-field.component.html',
  styleUrls: ['./read-only-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadOnlyFieldComponent implements OnChanges {
  private static NULLABLE_VALUES: unknown[] = [undefined, null, '']

  @Input()
  label: Nullable<string>

  @Input()
  value: Nullable<unknown>

  @Input()
  prefix: Nullable<string>

  @Input()
  suffix: Nullable<string>

  @Input()
  placeholder: Nullable<string>;

  @HostBinding('class.hidden')
  hidden = false;
  isNullish = false;

  constructor() {
  }

  ngOnChanges() {
    this.isNullish = ReadOnlyFieldComponent.NULLABLE_VALUES.indexOf(this.value) > -1
    this.hidden = !this.placeholder && this.isNullish
  }

}
