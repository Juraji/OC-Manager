import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {iif, Observable} from 'rxjs'

import {OcCharacter} from '#models/characters.model'
import {OcCharacterTrait} from '#models/traits.model'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiCharacterTraitsService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllTraits(): Observable<OcCharacterTrait[]> {
    return this.http.get<OcCharacterTrait[]>(this.baseUri())
  }

  getTraitById(traitId: string): Observable<OcCharacterTrait> {
    return this.http.get<OcCharacterTrait>(this.baseUri(traitId))
  }

  saveTrait(trait: OcCharacterTrait): Observable<OcCharacterTrait> {
    return iif(
      () => !!trait.id,
      this.http.put<OcCharacterTrait>(this.baseUri(trait.id), trait),
      this.http.post<OcCharacterTrait>(this.baseUri(), trait),
    )
  }

  deleteTrait(traitId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri(traitId))
  }

  getAllCharactersWithTrait(traitId: string): Observable<OcCharacter[]> {
    return this.http.get<OcCharacter[]>(this.baseUri(traitId, 'characters'))
  }

  getAllCharacterTraits(characterId: string): Observable<OcCharacterTrait[]> {
    return this.http.get<OcCharacterTrait[]>(this.baseUriByCharacter(characterId))
  }

  addTraitToCharacter(characterId: string, traitId: string): Observable<OcCharacterTrait> {
    return this.http.post<OcCharacterTrait>(this.baseUriByCharacter(characterId, traitId), null)
  }

  removeTraitFromCharacter(characterId: string, traitId: string): Observable<void> {
    return this.http.delete<void>(this.baseUriByCharacter(characterId, traitId))
  }

  protected override baseUri(...path: string[]): string {
    return super.baseUri('traits', ...path);
  }

  protected baseUriByCharacter(characterId: string, ...path: string[]): string {
    return super.baseUri('characters', characterId, 'traits', ...path);
  }
}
