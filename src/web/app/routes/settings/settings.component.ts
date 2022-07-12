import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {required, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {SettingsStore} from '#core/root-store'
import {takeUntilDestroyed} from '#core/rxjs'
import {OcSettings} from '#models/settings.model'

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {

  readonly formGroup: TypedFormGroup<OcSettings> = typedFormGroup({
    id: typedFormControl(''),
    useFixedDate: typedFormControl<boolean>(false),
    eventReferenceDate: typedFormControl<number>(Number.NaN, [required])
  })

  constructor(
    readonly store: SettingsStore
  ) {
  }

  ngOnInit(): void {
    const setRefDateFieldState = (enable: boolean) => enable
      ? this.formGroup.get('eventReferenceDate').enable()
      : this.formGroup.get('eventReferenceDate').disable()

    this.store.settings$
      .pipe(takeUntilDestroyed(this))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .subscribe(fd => {
        this.formGroup.patchValue(fd)
        setRefDateFieldState(fd.useFixedDate)
      })

    this.formGroup.get('useFixedDate').valueChanges
      .pipe(takeUntilDestroyed(this))
      .subscribe(setRefDateFieldState)
  }

  ngOnDestroy() {
  }

  onSaveSettings() {
    if (this.formGroup.valid) {
      this.store
        .saveSettings(this.formGroup.value)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .subscribe(fd => {
          this.formGroup.reset(fd)
          this.formGroup.updateValueAndValidity()
        })
    }
  }
}
