import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {OcCharacterRelationship} from '#models/characters.model'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiCharacterRelationshipsService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllByCharacterId(characterId: string): Observable<OcCharacterRelationship[]> {
    return this.http.get<OcCharacterRelationship[]>(this.baseUri(characterId))
  }

  createRelationship(
    characterId: string,
    relationship: OcCharacterRelationship,
  ): Observable<OcCharacterRelationship> {
    return this.http.post<OcCharacterRelationship>(this.baseUri(characterId), relationship)
  }

  deleteRelationship(characterId: string, relationshipId: string,): Observable<void> {
    return this.http.delete<void>(this.baseUri(characterId, relationshipId))
  }

  protected override baseUri(characterId: string, ...path: string[]): string {
    return super.baseUri('characters', characterId, 'relationships', ...path);
  }
}
