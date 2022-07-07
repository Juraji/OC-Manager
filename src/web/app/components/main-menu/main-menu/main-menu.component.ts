import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs'

import {SettingsStore} from '#core/root-store'

@Component({
  selector: 'ocm-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent implements OnInit {
  public readonly collapsed$ = new BehaviorSubject<boolean>(true)

  constructor(
    readonly eventSettings: SettingsStore
  ) {
  }

  ngOnInit(): void {
  }

  onToggleCollapse() {
    this.collapsed$.next(!this.collapsed$.value)
  }
}
