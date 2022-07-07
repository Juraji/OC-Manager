import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {defaultIfEmpty, map, mergeMap, Observable, shareReplay, tap} from 'rxjs'

import {numberSort, orderedSort} from '#core/arrays'
import {
  OcmApiCharacterMemoriesService,
  OcmApiCharacterRelationshipsService,
  OcmApiCharactersService,
  OcmApiCharacterTraitsService
} from '#core/ocm-api'
import {filterNotNull, once} from '#core/rxjs'
import {OcCharacter, OcCharacterRelationship} from '#models/characters.model'
import {OcMemory} from '#models/memories.model'
import {OcCharacterTrait} from '#models/traits.model'

interface CharacterEditStoreState {
  character: Nullable<OcCharacter>
  traits: EntityState<OcCharacterTrait>
  memories: EntityState<OcMemory>
  relationships: EntityState<OcCharacterRelationship>
}

export interface CharacterEditStoreData {
  character: Nullable<OcCharacter>
  traits: OcCharacterTrait[]
  memories: OcMemory[]
  relationships: OcCharacterRelationship[]
}

@Injectable()
export class CharacterEditStore extends ComponentStore<CharacterEditStoreState> {

  private readonly traitsAdapter = CharacterEditStore.createTraitsAdapter()
  private readonly traitsSelectors = this.traitsAdapter.getSelectors()

  private readonly memoriesAdapter = CharacterEditStore.createMemoriesAdapter()
  private readonly memoriesSelectors = this.memoriesAdapter.getSelectors()

  private readonly relationshipsAdapter = CharacterEditStore.createRelationshipsAdapter()
  private readonly relationshipsSelectors = this.relationshipsAdapter.getSelectors()

  public readonly characterId$: Observable<string | null> = this.select(s => s.character?.id ?? null)
  public readonly isNewCharacter$: Observable<boolean> = this.characterId$.pipe(map(id => !id))
  public readonly character$: Observable<OcCharacter> = this
    .select(s => s.character)
    .pipe(filterNotNull())

  public readonly thumbnailUri$: Observable<string> = this.characterId$
    .pipe(
      filterNotNull(),
      mergeMap(id => this.charactersService.getCharacterThumbnailUrl(id))
    )

  public readonly allTraits$: Observable<OcCharacterTrait[]> = this
    .select(s => s.traits)
    .pipe(map(this.traitsSelectors.selectAll), shareReplay(1))

  public readonly allMemories$: Observable<OcMemory[]> = this
    .select(s => s.memories)
    .pipe(map(this.memoriesSelectors.selectAll), shareReplay(1))

  public readonly allRelationships$: Observable<OcCharacterRelationship[]> = this
    .select(s => s.relationships)
    .pipe(map(this.relationshipsSelectors.selectAll), shareReplay(1))

  constructor(
    private readonly charactersService: OcmApiCharactersService,
    private readonly characterTraitsService: OcmApiCharacterTraitsService,
    private readonly characterMemoriesService: OcmApiCharacterMemoriesService,
    private readonly characterRelationshipsService: OcmApiCharacterRelationshipsService,
  ) {
    super()

    this.setState({
      character: null,
      traits: this.traitsAdapter.getInitialState(),
      memories: this.memoriesAdapter.getInitialState(),
      relationships: this.relationshipsAdapter.getInitialState(),
    })
  }

  setStoreData(data: CharacterEditStoreData) {
    this.setState(s => ({
      character: data.character,
      traits: this.traitsAdapter.setAll(data.traits, s.traits),
      memories: this.memoriesAdapter.setAll(data.memories, s.memories),
      relationships: this.relationshipsAdapter.setAll(data.relationships, s.relationships),
    }))
  }

  saveCharacter(changes: Partial<OcCharacter>): Observable<OcCharacter> {
    return this.characterId$
      .pipe(
        once(),
        mergeMap(id => !!id ? this.character$ : [{} as OcCharacter]),
        once(),
        defaultIfEmpty({} as OcCharacter),
        map(character => ({...character, ...changes})),
        mergeMap(character => this.charactersService.saveCharacter(character)),
        tap(character => this.patchState({character}))
      )
  }

  deleteCharacter() {
    return this.characterId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.charactersService.deleteCharacter(id))
      )
  }

  setCharacterThumbnail(file: File): Observable<void> {
    return this.characterId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.charactersService.createCharacterThumbnail(id, file))
      )
  }

  addTrait(traitId: string): Observable<OcCharacterTrait> {
    return this.characterId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.characterTraitsService.addTraitToCharacter(id, traitId)),
        tap(trait => this.patchState(s => ({
          traits: this.traitsAdapter.addOne(trait, s.traits)
        })))
      )
  }

  removeTrait(traitId: string): Observable<void> {
    return this.characterId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.characterTraitsService.removeTraitFromCharacter(id, traitId)),
        tap(() => this.patchState(s => ({
          traits: this.traitsAdapter.removeOne(traitId, s.traits)
        })))
      )
  }

  addCharacterRelationship(relationship: OcCharacterRelationship): Observable<OcCharacterRelationship> {
    return this.characterId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(sourceCharacterId => this.characterRelationshipsService
          .createRelationship(sourceCharacterId, {...relationship, sourceCharacterId})),
        tap(trait => this.patchState(s => ({
          relationships: this.relationshipsAdapter.addOne(trait, s.relationships)
        })))
      )
  }

  removeCharacterRelationship(relationshipId: string): Observable<void> {
    return this.characterId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.characterRelationshipsService
          .deleteRelationship(id, relationshipId)),
        tap(() => this.patchState(s => ({
          relationships: this.relationshipsAdapter.removeOne(relationshipId, s.relationships)
        })))
      )
  }

  private static createTraitsAdapter() {
    return createEntityAdapter<OcCharacterTrait>({
      selectId: e => e.id,
      sortComparer: orderedSort(e => e.traitType, 'OcBodyType', 'OcEthnicity', 'OcEyeColor', 'OcHairStyle', 'OcGender', 'OcSexuality', 'OcCustomTrait')
    })
  }

  private static createMemoriesAdapter() {
    return createEntityAdapter<OcMemory>({
      selectId: e => e.id,
      sortComparer: numberSort(e => e.date)
    })
  }

  private static createRelationshipsAdapter() {
    return createEntityAdapter<OcCharacterRelationship>({
      selectId: e => e.id,
      sortComparer: orderedSort(e => e.type, 'FAMILY', 'ROMANTIC', 'FRIENDSHIP')
    })
  }
}
