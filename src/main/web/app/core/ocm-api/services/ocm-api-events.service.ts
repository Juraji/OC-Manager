import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {iif, Observable} from 'rxjs'

import {OcmApiService} from '#core/ocm-api/services/ocm-api.service'
import {OcCharacter} from '#models/characters.model'
import {OcEvent, OcEventSettings} from '#models/events.model'

@Injectable()
export class OcmApiEventsService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllEvents(): Observable<OcEvent[]> {
    return this.http.get<OcEvent[]>(this.baseUri())
  }

  getEventById(eventId: string): Observable<OcEvent> {
    return this.http.get<OcEvent>(this.baseUri(eventId))
  }

  saveEvent(event: OcEvent): Observable<OcEvent> {
    return iif(
      () => !!event.id,
      this.http.put<OcEvent>(this.baseUri(event.id), event),
      this.http.post<OcEvent>(this.baseUri(), event),
    )
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri(eventId))
  }

  getEventCharacters(eventId: string): Observable<OcCharacter[]> {
    return this.http.get<OcCharacter[]>(this.baseUri(eventId, 'characters'))
  }

  addCharacterToEvent(eventId: string, characterId: string) {
    return this.http.post<void>(this.baseUri(eventId, 'characters', characterId), null)
  }

  removeCharacterFromEvent(eventId: string, characterId: string) {
    return this.http.delete<void>(this.baseUri(eventId, 'characters', characterId))
  }

  getEventSettings(): Observable<OcEventSettings> {
    return this.http.get<OcEventSettings>(this.baseUri('settings'))
  }

  updateEventSettings(settings: OcEventSettings): Observable<OcEventSettings> {
    return this.http.put<OcEventSettings>(this.baseUri('settings'), settings)
  }

  protected override baseUri(...path: string[]): string {
    return super.baseUri('events', ...path);
  }
}