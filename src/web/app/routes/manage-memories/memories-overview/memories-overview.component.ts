import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {PortfoliosStore} from '#core/root-store'
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
    private readonly portfoliosStore:PortfoliosStore,
    readonly store: MemoriesOverviewStore
  ) {
  }

  ngOnInit(): void {
    this.portfoliosStore.selectedPortfolioId$
      .pipe(takeUntilDestroyed(this))
      .subscribe(() => this.store.loadMemories())
  }

  ngOnDestroy() {
  }
}
