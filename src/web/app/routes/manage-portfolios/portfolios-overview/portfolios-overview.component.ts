import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Modals} from '@juraji/ng-bootstrap-modals'
import {mergeMap} from 'rxjs'

import {PortfoliosStore} from '#core/root-store'
import {OcPortfolio} from '#models/portfolios.model'

@Component({
  templateUrl: './portfolios-overview.component.html',
  styleUrls: ['./portfolios-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfoliosOverviewComponent implements OnInit {

  constructor(
    private readonly modals: Modals,
    readonly store: PortfoliosStore
  ) {
  }

  ngOnInit(): void {
  }

  onDeletePortfolio(portfolio: OcPortfolio) {
    this.modals
      .confirm(`Are you sure you want to delete the portfolio "${portfolio.name}"?`
        + '<br/><br/><span class="text-danger">All characters and events within this portfolio will be deleted!</span>')
      .onResolved
      .pipe(mergeMap(() => this.store.deletePortFolio(portfolio.id)))
      .subscribe()
  }
}
