import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {map} from 'rxjs'

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
    private readonly activatedRoute: ActivatedRoute,
    readonly store: CharacterOverviewStore,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this), map(d => d['storeData']))
      .subscribe(data => this.store.setStoreData(data))
  }

  ngOnDestroy() {
  }

  onExportCharacters() {
    this.store.exportCharacters()
  }
}
