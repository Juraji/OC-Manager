import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {OcMemory} from '#models/memories.model'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiCharacterMemoriesService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllByCharacterId(characterId: string): Observable<OcMemory[]> {
    return this.http.get<OcMemory[]>(this.baseUri(characterId))
  }

  protected override baseUri(characterId: string, ...path: string[]): string {
    return super.baseUri('characters', characterId, 'memories', ...path);
  }
}
