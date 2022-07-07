import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {Modals} from '@juraji/ng-bootstrap-modals'
import {map, mergeMap, skip, startWith} from 'rxjs'

import {notBlank, required, typedFormControl, TypedFormGroup, typedFormGroup} from '#core/forms'
import {SettingsStore} from '#core/root-store'
import {BooleanBehaviourSubject, once, takeUntilDestroyed} from '#core/rxjs'
import {OcMemory} from '#models/memories.model'

import {MemoryEditStore} from '../memory-edit.store'

type OcMemoryForm = Omit<OcMemory, 'id'>

@Component({
  selector: 'ocm-base-memory-form',
  templateUrl: './base-memory-form.component.html',
  styleUrls: ['./base-memory-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseMemoryFormComponent implements OnInit, OnDestroy {

  readonly editActive$ = new BooleanBehaviourSubject()
  readonly formGroup: TypedFormGroup<OcMemoryForm> = typedFormGroup<OcMemoryForm>({
    date: typedFormControl<number>(Number.NaN, [required]),
    title: typedFormControl('', [required, notBlank]),
    description: typedFormControl('', [notBlank]),
  })

  readonly memoryTitle = this.store.memory$
    .pipe(map(m => m.title), startWith('New memory'))

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modals: Modals,
    readonly settings: SettingsStore,
    readonly store: MemoryEditStore
  ) {
  }

  ngOnInit(): void {
    this.store.memory$
      .pipe(takeUntilDestroyed(this))
      .subscribe(m => this.populateForm(m))

    this.store.isNewMemory
      .pipe(takeUntilDestroyed(this))
      .subscribe(it => this.editActive$.next(it))
  }

  ngOnDestroy() {
  }

  onSaveMemory() {
    if (this.formGroup.valid) {
      const update = this.formGroup.value;

      this.store
        .saveMemory(update)
        .subscribe(m => {
          this.editActive$.setFalse()
          this.populateForm(m)
          return this.router.navigate(
            ['..', m.id],
            {relativeTo: this.activatedRoute, replaceUrl: true})
        })
    }
  }

  onDeleteMemory() {
    this.memoryTitle
      .pipe(
        skip(1), once(),
        mergeMap(label => this.modals
          .confirm(`Are you sure you want to delete the memory "${label}"?`)
          .onResolved),
        mergeMap(() => this.store.deleteMemory())
      )
      .subscribe(() => this.router.navigate(
        ['../..'],
        {relativeTo: this.activatedRoute}))
  }

  private populateForm(memory: OcMemory) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...formData} = memory
    this.formGroup.reset(formData)
  }
}
