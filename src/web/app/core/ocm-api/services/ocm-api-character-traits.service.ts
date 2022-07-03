import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {OcmApiService} from './ocm-api.service'
import {OcCharacterTrait} from '../../../models/traits.model'

@Injectable()
export class OcmApiCharacterTraitsService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllCharacterTraits(characterId: string): Observable<OcCharacterTrait[]> {
    return this.http.get<OcCharacterTrait[]>(this.baseUri(characterId))
  }

  addTraitToCharacter(characterId: string, traitId: string): Observable<OcCharacterTrait> {
    return this.http.post<OcCharacterTrait>(this.baseUri(characterId, traitId), null)
  }

  removeTraitFromCharacter(characterId: string, traitId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri(characterId, traitId))
  }

  protected override baseUri(characterId: string, ...path: string[]): string {
    return super.baseUri('characters', characterId, 'traits', ...path);
  }
}
