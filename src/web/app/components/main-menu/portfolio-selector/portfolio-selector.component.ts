import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {PortfoliosStore} from '#core/root-store'

@Component({
  selector: 'ocm-portfolio-selector',
  templateUrl: './portfolio-selector.component.html',
  styleUrls: ['./portfolio-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioSelectorComponent implements OnInit {

  constructor(
    readonly store: PortfoliosStore
  ) {
  }

  ngOnInit(): void {
  }

  onSelectPortfolio(id: string) {
    this.store.setSelectedPortfolioById(id)
  }
}
