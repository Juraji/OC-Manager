import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, tap} from 'rxjs'

import {numberSort, strSort} from '#core/arrays'
import {
  OcmApiCharacterEventsService,
  OcmApiCharacterRelationshipsService,
  OcmApiCharactersService,
  OcmApiCharacterTraitsService
} from '#core/ocm-api'
import {filterNotNull, once} from '#core/rxjs'
import {OcCharacter, OcCharacterRelationship} from '#models/characters.model'
import {OcEvent, OcEventSettings} from '#models/events.model'
import {OcCharacterTrait} from '#models/traits.model'

interface CharacterEditStoreState {
  character: Nullable<OcCharacter>
  traits: EntityState<OcCharacterTrait>
  events: EntityState<OcEvent>
  relationships: EntityState<OcCharacterRelationship>
  eventSettings: Nullable<OcEventSettings>
}

export interface CharacterEditStoreData {
  character: Nullable<OcCharacter>
  traits: OcCharacterTrait[]
  events: OcEvent[]
  relationships: OcCharacterRelationship[]
  eventSettings: OcEventSettings
}

@Injectable()
export class CharacterEditStore extends ComponentStore<CharacterEditStoreState> {

  private readonly traitsAdapter = CharacterEditStore.createTraitsAdapter()
  private readonly traitsSelectors = this.traitsAdapter.getSelectors()

  private readonly eventsAdapter = CharacterEditStore.createEventsAdapter()
  private readonly eventsSelectors = this.eventsAdapter.getSelectors()

  private readonly relationshipsAdapter = CharacterEditStore.createRelationshipsAdapter()
  private readonly relationshipsSelectors = this.relationshipsAdapter.getSelectors()

  public readonly characterId$: Observable<string | null> = this.select(s => s.character?.id ?? null)
  public readonly isNewCharacter: Observable<boolean> = this.characterId$.pipe(map(id => !id))
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
    .pipe(map(this.traitsSelectors.selectAll))

  public readonly allEvents$: Observable<OcEvent[]> = this
    .select(s => s.events)
    .pipe(map(this.eventsSelectors.selectAll))

  public readonly allRelationships$: Observable<OcCharacterRelationship[]> = this
    .select(s => s.relationships)
    .pipe(map(this.relationshipsSelectors.selectAll))

  public readonly eventsDate$ = this
    .select(s => s.eventSettings)
    .pipe(
      filterNotNull(),
      map(s => s.useFixedDate ? new Date(s.eventReferenceDate) : new Date())
    )

  constructor(
    private readonly charactersService: OcmApiCharactersService,
    private readonly characterTraitsService: OcmApiCharacterTraitsService,
    private readonly characterEventsService: OcmApiCharacterEventsService,
    private readonly characterRelationshipsService: OcmApiCharacterRelationshipsService,
  ) {
    super()

    this.setState({
      character: null,
      traits: this.traitsAdapter.getInitialState(),
      events: this.eventsAdapter.getInitialState(),
      relationships: this.relationshipsAdapter.getInitialState(),
      eventSettings: null
    })
  }

  setStoreData(data: CharacterEditStoreData) {
    this.setState(s => ({
      character: data.character,
      traits: this.traitsAdapter.setAll(data.traits, s.traits),
      events: this.eventsAdapter.setAll(data.events, s.events),
      relationships: this.relationshipsAdapter.setAll(data.relationships, s.relationships),
      eventSettings: data.eventSettings
    }))
  }

  saveCharacter(changes: Partial<OcCharacter>): Observable<OcCharacter> {
    return this.character$
      .pipe(
        once(),
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

  private static createTraitsAdapter() {
    return createEntityAdapter<OcCharacterTrait>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.traitType)
    })
  }

  private static createEventsAdapter() {
    return createEntityAdapter<OcEvent>({
      selectId: e => e.id,
      sortComparer: numberSort(e => e.date)
    })
  }

  private static createRelationshipsAdapter() {
    return createEntityAdapter<OcCharacterRelationship>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.type)
    })
  }
}
