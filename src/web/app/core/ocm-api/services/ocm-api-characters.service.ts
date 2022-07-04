import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core';
import {iif, Observable, of} from 'rxjs'

import {OcCharacter} from '#models/characters.model'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiCharactersService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllCharacters(): Observable<OcCharacter[]> {
    return this.http.get<OcCharacter[]>(this.baseUri())
  }

  getCharacterById(characterId: string): Observable<OcCharacter> {
    return this.http.get<OcCharacter>(this.baseUri(characterId))
  }

  saveCharacter(character: OcCharacter): Observable<OcCharacter> {
    return iif(
      () => !!character.id,
      this.http.put<OcCharacter>(this.baseUri(character.id), character),
      this.http.post<OcCharacter>(this.baseUri(), character)
    )
  }

  deleteCharacter(characterId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri(characterId))
  }

  getCharacterThumbnailUrl(characterId: string): Observable<string> {
    return of(this.baseUri(characterId, 'thumbnail'))
  }

  createCharacterThumbnail(characterId: string, file: File): Observable<void> {
    const fd = new FormData()
    fd.set('thumbnail', file, file.name)

    return this.http.post<void>(this.baseUri(characterId, 'thumbnail'), fd)
  }

  protected override baseUri(...path: string[]): string {
    return super.baseUri('characters', ...path);
  }
}
