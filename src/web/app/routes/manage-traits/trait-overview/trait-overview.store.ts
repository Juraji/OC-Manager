import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, tap} from 'rxjs'

import {chainSort, ifSort, orderedSort, strSort} from '#core/arrays'
import {OcmApiCharacterTraitsService} from '#core/ocm-api'
import {
  OcBodyType,
  OcCharacterTrait,
  OcCustomTrait,
  OcEthnicity,
  OcEyeColor,
  OcGender,
  OcHairStyle,
  OcSexuality
} from '#models/traits.model'

interface TraitOverviewStoreState {
  traits: EntityState<OcCharacterTrait>
}

@Injectable()
export class TraitOverviewStore extends ComponentStore<TraitOverviewStoreState> {

  private readonly traitAdapter = TraitOverviewStore.createTraitAdapter()
  private readonly traitSelectors = this.traitAdapter.getSelectors()

  readonly allTraits$ = this
    .select(s => s.traits)
    .pipe(map(this.traitSelectors.selectAll))

  constructor(
    private readonly service: OcmApiCharacterTraitsService
  ) {
    super()

    this.setState({
      traits: this.traitAdapter.getInitialState()
    })
  }

  readonly loadTraits: () => void = this.effect($ => $.pipe(
    tap(() => this.patchState(s => ({traits: this.traitAdapter.removeAll(s.traits)}))),
    mergeMap(() => this.service.getAllTraits()),
    tap(t => this.patchState(s => ({traits: this.traitAdapter.addOne(t, s.traits)}))),
  ))

  readonly deleteTrait: (traitId: string) => void = this.effect<string>($ => $.pipe(
    mergeMap(traitId => this.service.deleteTrait(traitId).pipe(map(() => traitId))),
    tap(traitId => this.patchState(s => ({
      traits: this.traitAdapter.removeOne(traitId, s.traits)
    })))
  ))

  private static createTraitAdapter() {
    return createEntityAdapter<OcCharacterTrait>({
      selectId: e => e.id,
      sortComparer: chainSort(
        ifSort('traitType', 'OcBodyType', strSort(e => (e as OcBodyType).description)),
        ifSort('traitType', 'OcEthnicity', strSort(e => (e as OcEthnicity).description)),
        ifSort('traitType', 'OcEyeColor', chainSort(strSort(e => (e as OcEyeColor).type), strSort(e => (e as OcEyeColor).variant))),
        ifSort('traitType', 'OcGender', strSort(e => (e as OcGender).description)),
        ifSort('traitType', 'OcHairStyle', chainSort(orderedSort(e => (e as OcHairStyle).length, 'SHAVED', 'SHORT', 'MEDIUM', 'LONG'), strSort(e => (e as OcHairStyle).baseColor))),
        ifSort('traitType', 'OcSexuality', strSort(e => (e as OcSexuality).description)),
        ifSort('traitType', 'OcCustomTrait', chainSort(strSort(e => (e as OcCustomTrait).label), strSort(e => (e as OcCustomTrait).description))),
        orderedSort(e => e.traitType, 'OcBodyType', 'OcEthnicity', 'OcEyeColor', 'OcHairStyle', 'OcGender', 'OcSexuality', 'OcCustomTrait')
      )
    })
  }
}
