import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, Resolve} from '@angular/router'
import {EMPTY, forkJoin, Observable} from 'rxjs'

import {
  OcmApiCharacterEventsService,
  OcmApiCharacterRelationshipsService,
  OcmApiCharactersService,
  OcmApiCharacterTraitsService
} from '#core/ocm-api'
import {ForkJoinSource} from '#core/rxjs'

import {CharacterEditStoreData} from './character-edit.store'

@Injectable()
export class CharacterEditResolve implements Resolve<CharacterEditStoreData> {

  constructor(
    private readonly charactersService: OcmApiCharactersService,
    private readonly traitsService: OcmApiCharacterTraitsService,
    private readonly eventsService: OcmApiCharacterEventsService,
    private readonly relationshipsService: OcmApiCharacterRelationshipsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CharacterEditStoreData> | CharacterEditStoreData {
    const characterId = route.paramMap.get('characterId')

    if (!characterId) {
      return EMPTY
    } else if (characterId === 'new') {
      return {
        character: null,
        traits: [],
        events: [],
        relationships: []
      }
    } else {
      const sources: ForkJoinSource<CharacterEditStoreData> = {
        character: this.charactersService.getCharacterById(characterId),
        traits: this.traitsService.getAllCharacterTraits(characterId),
        events: this.eventsService.getAllByCharacterId(characterId),
        relationships: this.relationshipsService.getAllByCharacterId(characterId)
      }

      return forkJoin(sources)
    }
  }
}
