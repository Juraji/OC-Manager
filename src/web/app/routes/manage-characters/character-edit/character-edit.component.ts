import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {map, skip} from 'rxjs'

import {PortfoliosStore} from '#core/root-store'
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

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly portfoliosStore: PortfoliosStore,
    readonly store: CharacterEditStore
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this), map(d => d['storeData']))
      .subscribe(d => this.store.setStoreData(d))

    this.portfoliosStore.selectedPortfolioId$
      .pipe(takeUntilDestroyed(this), skip(1))
      .subscribe(() => this.router.navigateByUrl('/'))
  }

  ngOnDestroy() {
  }

}
