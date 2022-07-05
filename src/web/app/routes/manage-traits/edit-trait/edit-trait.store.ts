import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {defaultIfEmpty, map, mergeMap, Observable, tap} from 'rxjs'

import {strSort} from '#core/arrays'
import {OcmApiCharacterTraitsService} from '#core/ocm-api'
import {filterNotNull, once} from '#core/rxjs'
import {OcCharacter} from '#models/characters.model'
import {OcCharacterTrait} from '#models/traits.model'

interface EditTraitStoreState {
  trait: Nullable<OcCharacterTrait>
  characters: EntityState<OcCharacter>
}

export interface EditTraitStoreData {
  trait: Nullable<OcCharacterTrait>
  characters: OcCharacter[]
}

@Injectable()
export class EditTraitStore extends ComponentStore<EditTraitStoreState> {

  private readonly characterAdapter = EditTraitStore.createCharacterAdapter()
  private readonly characterSelectors = this.characterAdapter.getSelectors()

  readonly traitId$ = this.select(s => s.trait?.id ?? null)
  readonly isNewTrait$ = this.traitId$.pipe(map(id => !id))
  readonly trait$ = this.select(s => s.trait).pipe(filterNotNull())
  readonly traitType$ = this.select(s => s.trait?.traitType ?? null)
  readonly characters$ = this
    .select(s => s.characters)
    .pipe(map(this.characterSelectors.selectAll))

  constructor(
    protected readonly traitService: OcmApiCharacterTraitsService,
  ) {
    super()

    this.setState({
      trait: null,
      characters: this.characterAdapter.getInitialState()
    })
  }

  setStoreData(data: EditTraitStoreData) {
    this.setState(s => ({
      trait: data.trait,
      characters: this.characterAdapter.setAll(data.characters, s.characters)
    }))
  }

  saveTrait(changes: Partial<OcCharacterTrait>): Observable<OcCharacterTrait> {
    return this.traitId$
      .pipe(
        once(),
        mergeMap(id => !!id ? this.trait$ : [{} as OcCharacterTrait]),
        once(),
        defaultIfEmpty({} as OcCharacterTrait),
        map(trait => ({...trait, ...changes})),
        mergeMap(trait => this.traitService.saveTrait(trait)),
        tap(trait => this.patchState({trait}))
      )
  }

  deleteTrait() {
    return this.traitId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.traitService.deleteTrait(id))
      )
  }

  private static createCharacterAdapter() {
    return createEntityAdapter<OcCharacter>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.name)
    })
  }
}
