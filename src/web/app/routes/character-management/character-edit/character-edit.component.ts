import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {map, startWith} from 'rxjs'

import {takeUntilDestroyed} from '#core/rxjs'

import {CharacterEditStore} from './character-edit.store'

@Component({
  selector: 'ocm-character-edit',
  templateUrl: './character-edit.component.html',
  styleUrls: ['./character-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CharacterEditStore]
})
export class CharacterEditComponent implements OnInit, OnDestroy {

  public readonly characterTitle$ = this.store.character$
    .pipe(map(c => c.name), startWith('New character'))

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    readonly store: CharacterEditStore
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this), map(d => d['storeData']))
      .subscribe(d => this.store.setStoreData(d))
  }

  ngOnDestroy() {
  }

}
