import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {PortfoliosStore} from '#core/root-store'
import {takeUntilDestroyed} from '#core/rxjs'

import {CharacterOverviewStore} from './character-overview.store'

@Component({
  templateUrl: './character-overview.component.html',
  styleUrls: ['./character-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CharacterOverviewStore]
})
export class CharacterOverviewComponent implements OnInit, OnDestroy {

  constructor(
    private readonly portfoliosStore: PortfoliosStore,
    readonly store: CharacterOverviewStore,
  ) {
  }

  ngOnInit(): void {
    this.portfoliosStore.selectedPortfolioId$
      .pipe(takeUntilDestroyed(this))
      .subscribe(() => this.store.loadCharacters())
  }

  ngOnDestroy() {
  }

  onExportCharacters() {
    this.store.exportCharacters()
  }
}
