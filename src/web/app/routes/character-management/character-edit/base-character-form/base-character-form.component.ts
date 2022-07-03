import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap'
import {map, Observable, startWith} from 'rxjs'

import {required, requiredNotBlank, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {BooleanBehaviourSubject, filterNotNull, takeUntilDestroyed} from '#core/rxjs'
import {OcCharacter} from '#models/characters.model'

import {CharacterEditStore} from '../character-edit.store'

type OcCharacterForm = Omit<OcCharacter, 'id'>

@Component({
  selector: 'ocm-base-character-form',
  templateUrl: './base-character-form.component.html',
  styleUrls: ['./base-character-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseCharacterFormComponent implements OnInit, OnDestroy {

  readonly startDobValue$: Observable<NgbDate> = this.store.character$
    .pipe(
      map(c => c.dateOfBirth),
      filterNotNull(),
      map(epoch => new Date(epoch)),
      map(d => new NgbDate(d.getFullYear(), d.getMonth(), d.getDate())),
      startWith(this.ngbCalendar.getToday())
    )
  readonly editActive$ = new BooleanBehaviourSubject()
  readonly formGroup: TypedFormGroup<OcCharacterForm> = typedFormGroup<OcCharacterForm>({
    name: typedFormControl('', [requiredNotBlank]),
    nickname: typedFormControl(''),
    dateOfBirth: typedFormControl(Number.NaN, [required]),
    notes: typedFormControl(''),
  })


  constructor(
    private readonly ngbCalendar: NgbCalendar,
    readonly store: CharacterEditStore
  ) {
    this.store.character$
      .pipe(takeUntilDestroyed(this))
      .subscribe(c => this.populateForm(c))

    this.store.isNewCharacter
      .pipe(takeUntilDestroyed(this))
      .subscribe(it => this.editActive$.next(it))
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  onToggleEdit() {
    this.editActive$.next(!this.editActive$.value)
  }

  onDateOfBirthSelected(e: NgbDate) {
    const d = new Date(e.year, e.month, e.day, 0, 0, 0, 0)
    this.formGroup.get('dateOfBirth').setValue(d.getTime())
  }

  onSaveCharacter() {
    if (this.formGroup.valid) {
      const fv = this.formGroup.value;
      const update: Partial<OcCharacter> = {
        ...fv,
      }

      this.store
        .saveCharacter(update)
        .subscribe(c => {
          this.onToggleEdit()
          this.populateForm(c)
        })
    }
  }

  private populateForm(character: OcCharacter) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...formData} = character
    this.formGroup.setValue(formData)
  }
}
