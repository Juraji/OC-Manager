import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {combineLatest, map, mergeMap, tap} from 'rxjs'

import {chainSort, orderedSort, strSort} from '#core/arrays'
import {OcmApiCharacterTraitsService} from '#core/ocm-api'
import {
  OcBodyType,
  OcCustomTrait,
  OcEthnicity,
  OcEyeColor,
  OcGender,
  OcHairStyle,
  OcSexuality
} from '#models/traits.model'

interface TraitSelectorStoreState {
  bodyTypes: EntityState<OcBodyType>
  ethnicities: EntityState<OcEthnicity>
  eyeColors: EntityState<OcEyeColor>
  genders: EntityState<OcGender>
  hairStyles: EntityState<OcHairStyle>
  customTraits: EntityState<OcCustomTrait>
  sexualities: EntityState<OcSexuality>
}

@Injectable()
export class TraitSelectorStore extends ComponentStore<TraitSelectorStoreState> {
  private readonly bodyTypeAdapter = TraitSelectorStore.createBodyTypeAdapter()
  private readonly bodyTypeSelectors = this.bodyTypeAdapter.getSelectors()

  private readonly ethnicityAdapter = TraitSelectorStore.createEthnicityAdapter()
  private readonly ethnicitySelectors = this.ethnicityAdapter.getSelectors()

  private readonly eyeColorAdapter = TraitSelectorStore.createEyeColorAdapter()
  private readonly eyeColorSelectors = this.eyeColorAdapter.getSelectors()

  private readonly genderAdapter = TraitSelectorStore.createGenderAdapter()
  private readonly genderSelectors = this.genderAdapter.getSelectors()

  private readonly hairStyleAdapter = TraitSelectorStore.createHairStyleAdapter()
  private readonly hairStyleSelectors = this.hairStyleAdapter.getSelectors()

  private readonly customTraitAdapter = TraitSelectorStore.createCustomTraitAdapter()
  private readonly customTraitSelectors = this.customTraitAdapter.getSelectors()

  private readonly sexualityAdapter = TraitSelectorStore.createSexualityAdapter()
  private readonly sexualitySelectors = this.sexualityAdapter.getSelectors()

  readonly bodyTypes$ = this
    .select(s => s.bodyTypes)
    .pipe(map(this.bodyTypeSelectors.selectAll))

  readonly ethnicities$ = this
    .select(s => s.ethnicities)
    .pipe(map(this.ethnicitySelectors.selectAll))

  readonly eyeColors$ = this
    .select(s => s.eyeColors)
    .pipe(map(this.eyeColorSelectors.selectAll))

  readonly hairStyles$ = this
    .select(s => s.hairStyles)
    .pipe(map(this.hairStyleSelectors.selectAll))

  readonly genders$ = this
    .select(s => s.genders)
    .pipe(map(this.genderSelectors.selectAll))

  readonly sexualities$ = this
    .select(s => s.sexualities)
    .pipe(map(this.sexualitySelectors.selectAll))

  readonly customTraits$ = this
    .select(s => s.customTraits)
    .pipe(map(this.customTraitSelectors.selectAll))

  readonly allTraits$ = combineLatest([
    this.bodyTypes$, this.ethnicities$, this.eyeColors$, this.hairStyles$,
    this.genders$, this.sexualities$, this.customTraits$
  ]).pipe(map(x => x.flat()))

  constructor(
    private readonly service: OcmApiCharacterTraitsService,
  ) {
    super()

    this.setState({
      bodyTypes: this.bodyTypeAdapter.getInitialState(),
      ethnicities: this.ethnicityAdapter.getInitialState(),
      eyeColors: this.eyeColorAdapter.getInitialState(),
      genders: this.genderAdapter.getInitialState(),
      hairStyles: this.hairStyleAdapter.getInitialState(),
      customTraits: this.customTraitAdapter.getInitialState(),
      sexualities: this.sexualityAdapter.getInitialState()
    })
  }

  readonly loadTraits: (omitTraitIds?: string[]) => void = this.effect<(string[] | undefined)>($ => $.pipe(
    mergeMap(omitIds => !!omitIds
      ? this.service.getAllTraits()
        .pipe(map(ts => ts.filter(t => !omitIds.includes(t.id))))
      : this.service.getAllTraits()
    ),
    tap(allTraits => this.patchState(s => ({
      bodyTypes: this.bodyTypeAdapter.setAll(
        allTraits.filter(t => t.traitType === 'OcBodyType') as OcBodyType[],
        s.bodyTypes
      ),
      ethnicities: this.ethnicityAdapter.setAll(
        allTraits.filter(t => t.traitType === 'OcEthnicity') as OcEthnicity[],
        s.ethnicities
      ),
      eyeColors: this.eyeColorAdapter.setAll(
        allTraits.filter(t => t.traitType === 'OcEyeColor') as OcEyeColor[],
        s.eyeColors
      ),
      genders: this.genderAdapter.setAll(
        allTraits.filter(t => t.traitType === 'OcGender') as OcGender[],
        s.genders
      ),
      hairStyles: this.hairStyleAdapter.setAll(
        allTraits.filter(t => t.traitType === 'OcHairStyle') as OcHairStyle[],
        s.hairStyles
      ),
      customTraits: this.customTraitAdapter.setAll(
        allTraits.filter(t => t.traitType === 'OcCustomTrait') as OcCustomTrait[],
        s.customTraits
      ),
      sexualities: this.sexualityAdapter.setAll(
        allTraits.filter(t => t.traitType === 'OcSexuality') as OcSexuality[],
        s.sexualities
      ),
    })))
  ))

  private static createBodyTypeAdapter() {
    return createEntityAdapter<OcBodyType>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.description)
    })
  }

  private static createEthnicityAdapter() {
    return createEntityAdapter<OcEthnicity>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.description)
    })
  }

  private static createEyeColorAdapter() {
    return createEntityAdapter<OcEyeColor>({
      selectId: e => e.id,
      sortComparer: chainSort(strSort(e => e.type), strSort(e => e.variant))
    })
  }

  private static createGenderAdapter() {
    return createEntityAdapter<OcGender>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.description)
    })
  }

  private static createHairStyleAdapter() {
    return createEntityAdapter<OcHairStyle>({
      selectId: e => e.id,
      sortComparer: chainSort(orderedSort(e => e.length, 'SHAVED', 'SHORT', 'MEDIUM', 'LONG'), strSort(e => e.baseColor))
    })
  }

  private static createCustomTraitAdapter() {
    return createEntityAdapter<OcCustomTrait>({
      selectId: e => e.id,
      sortComparer: chainSort(strSort(e => e.label), strSort(e => e.description))
    })
  }

  private static createSexualityAdapter() {
    return createEntityAdapter<OcSexuality>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.description)
    })
  }
}
