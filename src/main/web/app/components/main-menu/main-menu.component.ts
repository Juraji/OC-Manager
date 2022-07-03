import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Component({
  selector: 'ocm-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent implements OnInit {
  public readonly collapsed$ = new BehaviorSubject<boolean>(true)

  constructor() {
  }

  ngOnInit(): void {
  }

  onToggleCollapse() {
    this.collapsed$.next(!this.collapsed$.value)
  }
}
