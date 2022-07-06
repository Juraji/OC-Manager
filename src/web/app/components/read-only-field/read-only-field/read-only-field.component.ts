import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {BooleanInput} from '#core/ng-extensions'

@Component({
  selector: 'ocm-read-only-field',
  templateUrl: './read-only-field.component.html',
  styleUrls: ['./read-only-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadOnlyFieldComponent implements OnInit {

  @Input()
  label: Nullable<string>

  @Input()
  value: Nullable<unknown>

  @Input()
  @BooleanInput()
  hideWhenEmpty: boolean | string = true;

  @Input()
  placeholder = 'No value or placeholder';

  constructor() {
  }

  ngOnInit(): void {
  }

}
