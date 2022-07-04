import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {Modals} from '@juraji/ng-bootstrap-modals'
import {map, mergeMap, of, skip, startWith, Subject, switchMap} from 'rxjs'

import {EventSettingsStore} from '#core/event-settings'
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
    .pipe(switchMap(uri => this.refreshThumbnailImg$
        .pipe(
          map(() => `${uri}?t=${new Date().getTime()}`),
          startWith(uri)
        )))

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modals: Modals,
    readonly store: CharacterEditStore,
    readonly eventSettings: EventSettingsStore,
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
          return this.router.navigate(['..', c.id], {relativeTo: this.activatedRoute})
        })
    }
  }

  onDeleteCharacter() {
    this.characterTitle$
      .pipe(
        skip(1), once(),
        mergeMap(name => this.modals.confirm(`Are you sure you want to delete ${name}?`).onResolved),
        mergeMap(() => this.store.deleteCharacter())
      )
      .subscribe(() => this.router.navigate(['/']))
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
