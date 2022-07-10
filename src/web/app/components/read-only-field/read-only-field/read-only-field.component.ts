import {ChangeDetectionStrategy, Component, HostBinding, HostListener, Input, OnChanges} from '@angular/core';
import {combineLatest, map} from 'rxjs'

import {ObservableInputs} from '#core/rxjs'

@Component({
  selector: 'ocm-read-only-field',
  templateUrl: './read-only-field.component.html',
  styleUrls: ['./read-only-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadOnlyFieldComponent implements OnChanges {
  private readonly inputs = new ObservableInputs()

  @Input()
  label: Nullable<string>

  @Input()
  value: Nullable<unknown>
  value$ = this.inputs.observe(() => this.value)

  @Input()
  prefix: Nullable<string>

  @Input()
  suffix: Nullable<string>

  @Input()
  placeholder: Nullable<string>;
  placeholder$ = this.inputs.observe(() => this.placeholder)

  @HostBinding('$.class.empty')
  @HostListener('$.class.empty')
  readonly isNullish$ = this.value$
    .pipe(map(v => v === undefined || v === null || (typeof v === 'string' && v.length === 0)))

  @HostBinding('$.class.hidden')
  @HostListener('$.class.hidden')
  readonly hidden$ = combineLatest([this.placeholder$, this.isNullish$])
    .pipe(map(([ph, n]) => !ph && n))

  constructor() {
  }

  ngOnChanges() {
    this.inputs.onChanges()
  }

}
