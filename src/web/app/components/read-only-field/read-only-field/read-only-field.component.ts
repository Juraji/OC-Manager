import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ocm-read-only-field',
  templateUrl: './read-only-field.component.html',
  styleUrls: ['./read-only-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadOnlyFieldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
