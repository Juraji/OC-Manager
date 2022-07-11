import {Injectable} from '@angular/core'
import {Resolve} from '@angular/router'
import {forkJoin, Observable, toArray} from 'rxjs'

import {OcmApiCharactersService} from '#core/ocm-api'
import {catchToEmpty, ForkJoinSource} from '#core/rxjs'

import {CharacterOverviewStoreData} from './character-overview.store'

@Injectable()
export class CharacterOverviewResolve implements Resolve<CharacterOverviewStoreData> {

  constructor(private readonly charactersService: OcmApiCharactersService) {
  }

  resolve(): Observable<CharacterOverviewStoreData> {
    const sources: ForkJoinSource<CharacterOverviewStoreData> = {
      characters: this.charactersService.getAllCharacters().pipe(toArray())
    }

    return forkJoin(sources).pipe(catchToEmpty());
  }
}
