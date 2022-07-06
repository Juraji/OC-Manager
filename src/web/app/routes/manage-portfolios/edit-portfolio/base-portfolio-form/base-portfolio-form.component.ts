import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ocm-base-portfolio-form',
  templateUrl: './base-portfolio-form.component.html',
  styleUrls: ['./base-portfolio-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasePortfolioFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
