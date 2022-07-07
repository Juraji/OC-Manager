import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {map} from 'rxjs'

import {takeUntilDestroyed} from '#core/rxjs'

import {MemoriesOverviewStore} from './memories-overview.store'

@Component({
  selector: 'ocm-memories-overview',
  templateUrl: './memories-overview.component.html',
  styleUrls: ['./memories-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MemoriesOverviewStore]
})
export class MemoriesOverviewComponent implements OnInit, OnDestroy {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    readonly store: MemoriesOverviewStore
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
