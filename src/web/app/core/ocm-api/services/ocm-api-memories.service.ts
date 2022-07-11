import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {iif, Observable} from 'rxjs'

import {OcCharacter} from '#models/characters.model'
import {OcMemory} from '#models/memories.model'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiMemoriesService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllMemories(): Observable<OcMemory> {
    return this.http.get<OcMemory>(this.baseUri())
  }

  getMemoryById(memoryId: string): Observable<OcMemory> {
    return this.http.get<OcMemory>(this.baseUri(memoryId))
  }

  saveMemory(memory: OcMemory): Observable<OcMemory> {
    return iif(
      () => !!memory.id,
      this.http.put<OcMemory>(this.baseUri(memory.id), memory),
      this.http.post<OcMemory>(this.baseUri(), memory),
    )
  }

  deleteMemory(memoryId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri(memoryId))
  }

  getMemoryCharacters(memoryId: string): Observable<OcCharacter> {
    return this.http.get<OcCharacter>(this.baseUri(memoryId, 'characters'))
  }

  addCharacterToMemory(memoryId: string, characterId: string): Observable<OcCharacter> {
    return this.http.post<OcCharacter>(this.baseUri(memoryId, 'characters', characterId), null)
  }

  removeCharacterFromMemory(memoryId: string, characterId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri(memoryId, 'characters', characterId))
  }

  protected override baseUri(...path: string[]): string {
    return super.baseUri('memories', ...path);
  }
}
