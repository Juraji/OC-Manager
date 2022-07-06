import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {Observable, tap} from 'rxjs'

import {OcmApiEventsService} from '#core/ocm-api'
import {filterNotNull} from '#core/rxjs'
import {OcEventSettings} from '#models/events.model'

interface EventSettingsStoreState {
  settings: Nullable<OcEventSettings>
  eventReferenceDate: Date
}

@Injectable()
export class EventSettingsStore extends ComponentStore<EventSettingsStoreState> {

  readonly settings$: Observable<OcEventSettings> = this.select(s => s.settings).pipe(filterNotNull())

  readonly eventsDate$ = this.select(s => s.eventReferenceDate)

  constructor(
    private readonly service: OcmApiEventsService,
  ) {
    super({
      settings: null,
      eventReferenceDate: new Date()
    })
  }

  initialize(): Observable<OcEventSettings> {
    return this.service
      .getEventSettings()
      .pipe(tap(settings => this.patchSettings(settings)))
  }

  saveEventSettings(update: OcEventSettings) {
    return this.service
      .updateEventSettings(update)
      .pipe(tap(settings => this.patchSettings(settings)))
  }

  private patchSettings(settings: OcEventSettings) {
    this.patchState(s => ({
      settings,
      eventReferenceDate: settings.useFixedDate
        ? new Date(settings.eventReferenceDate)
        : s.eventReferenceDate
    }))
  }
}
