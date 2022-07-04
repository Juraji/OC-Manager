import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {map, mergeMap, of, repeat, startWith, Subject} from 'rxjs'

import {notBlank, required, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {BooleanBehaviourSubject, filterNotNull, once, takeUntilDestroyed} from '#core/rxjs'
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

  public readonly characterTitle$ = this.store.character$
    .pipe(map(c => c.name), startWith('New character'))

  private readonly refreshThumbnailImg$ = new Subject<void>()
  readonly thumbnailUri$ = this.store.thumbnailUri$
    .pipe(
      once(),
      repeat({delay: () => this.refreshThumbnailImg$}),
      map(uri => `${uri}?t=${new Date().getTime()}`)
    )

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

  onSetThumbnail(e: FileList) {
    of(e.item(0))
      .pipe(filterNotNull())
      .pipe(mergeMap(f => this.store.setCharacterThumbnail(f)))
      .subscribe(() => this.refreshThumbnailImg$.next())
  }

  onSetThumbnailViaFileInput(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!!files && files.length > 0) this.onSetThumbnail(files)
  }

  private populateForm(character: OcCharacter) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...formData} = character
    this.formGroup.reset(formData)
  }
}
