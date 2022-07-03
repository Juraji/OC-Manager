import {ComponentStore} from '@ngrx/component-store'
import {OcCharacter, OcCharacterRelationship} from '../../../models/characters.model'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {OcCharacterTrait} from '../../../models/traits.model'
import {OcEvent} from '../../../models/events.model'
import {numberSort, strSort} from '../../../core/arrays'
import {map, Observable} from 'rxjs'
import {filterNotNull} from '../../../core/rxjs'

interface CharacterEditStoreState {
  character: Nullable<OcCharacter>
  traits: EntityState<OcCharacterTrait>
  events: EntityState<OcEvent>
  relationships: EntityState<OcCharacterRelationship>
}

export interface CharacterEditStoreData {
  character: OcCharacter
  traits: OcCharacterTrait[]
  events: OcEvent[]
  relationships: OcCharacterRelationship[]
}

export class CharacterEditStore extends ComponentStore<CharacterEditStoreState> {

  private readonly traitsAdapter = CharacterEditStore.createTraitsAdapter()
  private readonly traitsSelectors = this.traitsAdapter.getSelectors()

  private readonly eventsAdapter = CharacterEditStore.createEventsAdapter()
  private readonly eventsSelectors = this.eventsAdapter.getSelectors()

  private readonly relationshipsAdapter = CharacterEditStore.createRelationshipsAdapter()
  private readonly relationshipsSelectors = this.relationshipsAdapter.getSelectors()

  public readonly characterId$: Observable<string | null> = this.select(s => s.character?.id ?? null)
  public readonly character$: Observable<OcCharacter> = this
    .select(s => s.character)
    .pipe(filterNotNull())

  public readonly allTraits$: Observable<OcCharacterTrait[]> = this
    .select(s => s.traits)
    .pipe(map(this.traitsSelectors.selectAll))

  public readonly allEvents$: Observable<OcEvent[]> = this
    .select(s => s.events)
    .pipe(map(this.eventsSelectors.selectAll))

  public readonly allRelationships$: Observable<OcCharacterRelationship[]> = this
    .select(s => s.relationships)
    .pipe(map(this.relationshipsSelectors.selectAll))

  constructor() {
    super()

    this.setState({
      character: null,
      traits: this.traitsAdapter.getInitialState(),
      events: this.eventsAdapter.getInitialState(),
      relationships: this.relationshipsAdapter.getInitialState()
    })
  }

  setStoreData(data: CharacterEditStoreData) {
    this.setState(s => ({
      character: data.character,
      traits: this.traitsAdapter.setAll(data.traits, s.traits),
      events: this.eventsAdapter.setAll(data.events, s.events),
      relationships: this.relationshipsAdapter.setAll(data.relationships, s.relationships),
    }))
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
