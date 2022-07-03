import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {OcEvent} from '#models/events.model'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiCharacterEventsService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllByCharacterId(characterId: string): Observable<OcEvent[]> {
    return this.http.get<OcEvent[]>(this.baseUri(characterId))
  }

  protected override baseUri(characterId: string, ...path: string[]): string {
    return super.baseUri('characters', characterId, 'events', ...path);
  }
}
