import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {notBlank, required, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {BooleanBehaviourSubject, takeUntilDestroyed} from '#core/rxjs'
import {OcCharacter} from '#models/characters.model'

import {CharacterEditStore} from '../character-edit.store'

type OcCharacterForm = Omit<OcCharacter, 'id'>

@Component({
  selector: 'ocm-base-character-form',
  templateUrl: './base-character-form.component.html',
  styleUrls: ['./base-character-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseCharacterFormComponent implements OnInit, OnDestroy {

  readonly editActive$ = new BooleanBehaviourSubject()
  readonly formGroup: TypedFormGroup<OcCharacterForm> = typedFormGroup<OcCharacterForm>({
    name: typedFormControl('', [required, notBlank]),
    nickname: typedFormControl('', [notBlank]),
    dateOfBirth: typedFormControl(Number.NaN, [required]),
    notes: typedFormControl('', [notBlank]),
  })


  constructor(
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

  onSaveCharacter() {
    if (this.formGroup.valid) {
      const fv = this.formGroup.value;
      const update: Partial<OcCharacter> = {
        ...fv,
      }

      this.store
        .saveCharacter(update)
        .subscribe(c => {
          this.editActive$.setFalse()
          this.populateForm(c)
        })
    }
  }

  private populateForm(character: OcCharacter) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...formData} = character
    this.formGroup.reset(formData)
  }
}
