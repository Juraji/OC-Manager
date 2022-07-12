import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Modals} from '@juraji/ng-bootstrap-modals'
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
    readonly settings: SettingsStore,
    private readonly modals: Modals,
  ) {
  }

  ngOnInit(): void {
  }

  onToggleCollapse() {
    this.collapsed$.next(!this.collapsed$.value)
  }

  onShutdownApplication() {
    this.settings
      .shutdownApplication()
      .subscribe(() => this.modals.shade(
        'Browser security prevents me from closing myself.<br />' +
        'You can now close this window yourself'))
  }
}
