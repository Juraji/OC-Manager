import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {Observable, tap} from 'rxjs'

import {OcmApiSettingsService} from '#core/ocm-api/services/ocm-api-settings.service'
import {filterNotNull} from '#core/rxjs'
import {OcSettings} from '#models/settings.model'

interface SettingsStoreState {
  settings: Nullable<OcSettings>
  eventReferenceDate: Date
}

@Injectable()
export class SettingsStore extends ComponentStore<SettingsStoreState> {

  readonly settings$: Observable<OcSettings> = this.select(s => s.settings).pipe(filterNotNull())

  readonly eventsDate$ = this.select(s => s.eventReferenceDate)

  constructor(
    private readonly service: OcmApiSettingsService,
  ) {
    super({
      settings: null,
      eventReferenceDate: new Date()
    })
  }

  initialize(): Observable<OcSettings> {
    return this.service
      .getEventSettings()
      .pipe(tap(settings => this.patchSettings(settings)))
  }

  saveSettings(update: OcSettings) {
    return this.service
      .updateEventSettings(update)
      .pipe(tap(settings => this.patchSettings(settings)))
  }

  private patchSettings(settings: OcSettings) {
    this.patchState(s => ({
      settings,
      eventReferenceDate: settings.useFixedDate
        ? new Date(settings.eventReferenceDate)
        : s.eventReferenceDate
    }))
  }
}
