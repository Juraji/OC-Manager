import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {Observable, tap} from 'rxjs'

import {OcmApiActuatorService} from '#core/ocm-api/services/ocm-api-actuator.service'
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

  readonly useFixedDate$ = this.select(s => s.settings?.useFixedDate || false)
  readonly eventsDate$ = this.select(s => s.eventReferenceDate)

  constructor(
    private readonly service: OcmApiSettingsService,
    private readonly systemService: OcmApiActuatorService,
  ) {
    super({
      settings: null,
      eventReferenceDate: new Date()
    })
  }

  initialize(): Observable<OcSettings> {
    return this.service
      .getSettings()
      .pipe(tap(settings => this.patchSettings(settings)))
  }

  saveSettings(update: OcSettings) {
    return this.service
      .updateSettings(update)
      .pipe(tap(settings => this.patchSettings(settings)))
  }

  shutdownApplication(): Observable<void> {
    return this.systemService.shutdown()
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
