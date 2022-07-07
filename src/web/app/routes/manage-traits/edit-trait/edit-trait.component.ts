import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {map} from 'rxjs'

import {takeUntilDestroyed} from '#core/rxjs'

import {EditTraitStore} from './edit-trait.store'

@Component({
  templateUrl: './edit-trait.component.html',
  styleUrls: ['./edit-trait.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EditTraitStore]
})
export class EditTraitComponent implements OnInit, OnDestroy {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    readonly store: EditTraitStore,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this), map(d => d['storeData']))
      .subscribe(sd => this.store.setStoreData(sd))
  }

  ngOnDestroy() {
  }

}
