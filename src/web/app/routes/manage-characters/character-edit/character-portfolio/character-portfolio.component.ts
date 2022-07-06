import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import {PortfoliosStore} from '#core/root-store'

@Component({
  selector: 'ocm-character-portfolio',
  templateUrl: './character-portfolio.component.html',
  styleUrls: ['./character-portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterPortfolioComponent implements OnInit {

  constructor(
    readonly portfolioStore: PortfoliosStore
  ) { }

  ngOnInit(): void {
  }

}
