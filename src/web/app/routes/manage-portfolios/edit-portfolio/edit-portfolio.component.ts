import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ocm-edit-portfolio',
  templateUrl: './edit-portfolio.component.html',
  styleUrls: ['./edit-portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPortfolioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
