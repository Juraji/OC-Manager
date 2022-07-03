import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {OcmApiService} from './ocm-api.service'
import {OcCharacterRelationship, OcCharacterRelationshipType} from '../../../models/characters.model'

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
    targetCharacterId: string,
    type: OcCharacterRelationshipType,
    description: string
  ): Observable<OcCharacterRelationship> {
    const params = {type, description, targetCharacterId}
    return this.http.post<OcCharacterRelationship>(this.baseUri(characterId), null, {params})
  }

  updateRelationship(
    characterId: string,
    relationshipId: string,
    type: OcCharacterRelationshipType,
    description: string
  ): Observable<OcCharacterRelationship> {
    const params = {type, description}
    return this.http.put<OcCharacterRelationship>(this.baseUri(characterId, relationshipId), null, {params})
  }

  deleteRelationship(characterId: string, relationshipId: string,): Observable<void> {
    return this.http.delete<void>(this.baseUri(characterId, relationshipId))
  }

  protected override baseUri(characterId: string, ...path: string[]): string {
    return super.baseUri('characters', characterId, 'relationships', ...path);
  }
}
