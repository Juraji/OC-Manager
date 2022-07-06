import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {required, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {EventSettingsStore} from '#core/root-store'
import {takeUntilDestroyed} from '#core/rxjs'
import {OcEventSettings} from '#models/events.model'

@Component({
  selector: 'ocm-event-settings',
  templateUrl: './event-settings.component.html',
  styleUrls: ['./event-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSettingsComponent implements OnInit, OnDestroy {

  readonly formGroup: TypedFormGroup<OcEventSettings> = typedFormGroup({
    id: typedFormControl(''),
    useFixedDate: typedFormControl<boolean>(false),
    eventReferenceDate: typedFormControl<number>(Number.NaN, [required])
  })

  constructor(
    readonly store: EventSettingsStore
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
        this.formGroup.setValue(fd)
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
        .saveEventSettings(this.formGroup.value)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .subscribe(fd => {
          this.formGroup.reset(fd)
          this.formGroup.updateValueAndValidity()
        })
    }
  }
}
