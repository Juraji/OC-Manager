import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {map, skip} from 'rxjs'

import {PortfoliosStore} from '#core/root-store'
import {takeUntilDestroyed} from '#core/rxjs'

import {EditPortfolioStore} from './edit-portfolio.store'

@Component({
  selector: 'ocm-edit-portfolio',
  templateUrl: './edit-portfolio.component.html',
  styleUrls: ['./edit-portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EditPortfolioStore]
})
export class EditPortfolioComponent implements OnInit, OnDestroy {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly store: EditPortfolioStore,
    private readonly portfoliosStore:PortfoliosStore
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this), map(d => d['storeData']))
      .subscribe(sd => this.store.setStoreData(sd))

    this.portfoliosStore.selectedPortfolioId$
      .pipe(takeUntilDestroyed(this),skip(1))
      .subscribe(id => this.router.navigate(['../', id], {relativeTo: this.activatedRoute}))
  }

  ngOnDestroy() {
  }

}
