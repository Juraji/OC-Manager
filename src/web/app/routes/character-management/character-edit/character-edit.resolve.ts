import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router'
import {CharacterEditStoreData} from './character-edit.store'
import {Injectable} from '@angular/core'
import {EMPTY, forkJoin, Observable} from 'rxjs'
import {OcmApiCharacterRelationshipsService, OcmApiCharactersService, OcmApiCharacterTraitsService} from '../../../core/ocm-api'
import {ForkJoinSource} from '../../../core/rxjs'

@Injectable()
export class CharacterEditResolve implements Resolve<CharacterEditStoreData> {

  constructor(
    private readonly charactersService: OcmApiCharactersService,
    private readonly traitsService: OcmApiCharacterTraitsService,
    private readonly relationshipsService: OcmApiCharacterRelationshipsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CharacterEditStoreData> {
    const characterId = route.paramMap.get("characterId")

    if (!characterId) {
      return EMPTY
    } else if (characterId === 'new') {
      return EMPTY
    } else {
      const sources: ForkJoinSource<CharacterEditStoreData> = {
        character: this.charactersService.getCharacterById(characterId),
        traits: this.traitsService.getAllCharacterTraits(characterId),
        events: [[]], // TODO: Is there an endpoint for this?
        relationships: this.relationshipsService.getAllByCharacterId(characterId)
      }

      return forkJoin(sources)
    }
  }
}
