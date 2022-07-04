import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, tap} from 'rxjs'

import {chainSort, strSort} from '#core/arrays'
import {OcmApiTraitsService} from '#core/ocm-api'
import {OcBodyType, OcCustomTrait, OcEthnicity, OcEyeColor, OcGenderPreference, OcHairStyle} from '#models/traits.model'

interface TraitSelectorStoreState {
  bodyTypes: EntityState<OcBodyType>
  ethnicities: EntityState<OcEthnicity>
  eyeColors: EntityState<OcEyeColor>
  genderPreferences: EntityState<OcGenderPreference>
  hairStyles: EntityState<OcHairStyle>
  customTraits: EntityState<OcCustomTrait>
}

@Injectable()
export class TraitSelectorStore extends ComponentStore<TraitSelectorStoreState> {
  private readonly bodyTypeAdapter = TraitSelectorStore.createBodyTypeAdapter()
  private readonly bodyTypeSelectors = this.bodyTypeAdapter.getSelectors()

  private readonly ethnicityAdapter = TraitSelectorStore.createEthnicityAdapter()
  private readonly ethnicitySelectors = this.ethnicityAdapter.getSelectors()

  private readonly eyeColorAdapter = TraitSelectorStore.createEyeColorAdapter()
  private readonly eyeColorSelectors = this.eyeColorAdapter.getSelectors()

  private readonly genderPreferenceAdapter = TraitSelectorStore.createGenderPreferenceAdapter()
  private readonly genderPreferenceSelectors = this.genderPreferenceAdapter.getSelectors()

  private readonly hairStyleAdapter = TraitSelectorStore.createHairStyleAdapter()
  private readonly hairStyleSelectors = this.hairStyleAdapter.getSelectors()

  private readonly customTraitAdapter = TraitSelectorStore.createCustomTraitAdapter()
  private readonly customTraitSelectors = this.customTraitAdapter.getSelectors()

  public allBodyTypes$ = this
    .select(s => s.bodyTypes)
    .pipe(map(this.bodyTypeSelectors.selectAll))

  public allEthnicities$ = this
    .select(s => s.ethnicities)
    .pipe(map(this.ethnicitySelectors.selectAll))

  public allEyeColors$ = this
    .select(s => s.eyeColors)
    .pipe(map(this.eyeColorSelectors.selectAll))

  public allGenderPreferences$ = this
    .select(s => s.genderPreferences)
    .pipe(map(this.genderPreferenceSelectors.selectAll))

  public allHairStyles$ = this
    .select(s => s.hairStyles)
    .pipe(map(this.hairStyleSelectors.selectAll))

  public allCustomTraits$ = this
    .select(s => s.customTraits)
    .pipe(map(this.customTraitSelectors.selectAll))

  constructor(
    private readonly service: OcmApiTraitsService,
  ) {
    super()

    this.setState({
      bodyTypes: this.bodyTypeAdapter.getInitialState(),
      ethnicities: this.ethnicityAdapter.getInitialState(),
      eyeColors: this.eyeColorAdapter.getInitialState(),
      genderPreferences: this.genderPreferenceAdapter.getInitialState(),
      hairStyles: this.hairStyleAdapter.getInitialState(),
      customTraits: this.customTraitAdapter.getInitialState(),
    })

    this.loadTraits()
  }

  loadTraits(omitTraitIds: string[] = []) {
    this.loadBodyTypes(omitTraitIds)
    this.loadEthnicities(omitTraitIds)
    this.loadEyeColors(omitTraitIds)
    this.loadGenderPreferences(omitTraitIds)
    this.loadHairStyles(omitTraitIds)
    this.loadCustomTraits(omitTraitIds)
  }

  private readonly loadBodyTypes = this.effect<string[]>($ => $.pipe(
    mergeMap(omitIds => this.service
      .getAllBodyTypes()
      .pipe(map(traits => traits.filter(t => !omitIds.includes(t.id))))),
    tap(traits => this.patchState(s => ({
      bodyTypes: this.bodyTypeAdapter.setAll(traits, s.bodyTypes)
    })))
  ))

  private readonly loadEthnicities = this.effect<string[]>($ => $.pipe(
    mergeMap(omitIds => this.service
      .getAllEthnicities()
      .pipe(map(traits => traits.filter(t => !omitIds.includes(t.id))))),
    tap(traits => this.patchState(s => ({
      ethnicities: this.ethnicityAdapter.setAll(traits, s.ethnicities)
    })))
  ))

  private readonly loadEyeColors = this.effect<string[]>($ => $.pipe(
    mergeMap(omitIds => this.service
      .getAllEyeColors()
      .pipe(map(traits => traits.filter(t => !omitIds.includes(t.id))))),
    tap(traits => this.patchState(s => ({
      eyeColors: this.eyeColorAdapter.setAll(traits, s.eyeColors)
    })))
  ))

  private readonly loadGenderPreferences = this.effect<string[]>($ => $.pipe(
    mergeMap(omitIds => this.service
      .getAllGenderPreferences()
      .pipe(map(traits => traits.filter(t => !omitIds.includes(t.id))))),
    tap(traits => this.patchState(s => ({
      genderPreferences: this.genderPreferenceAdapter.setAll(traits, s.genderPreferences)
    })))
  ))

  private readonly loadHairStyles = this.effect<string[]>($ => $.pipe(
    mergeMap(omitIds => this.service
      .getAllHairStyles()
      .pipe(map(traits => traits.filter(t => !omitIds.includes(t.id))))),
    tap(traits => this.patchState(s => ({
      hairStyles: this.hairStyleAdapter.setAll(traits, s.hairStyles)
    })))
  ))

  private readonly loadCustomTraits = this.effect<string[]>($ => $.pipe(
    mergeMap(omitIds => this.service
      .getAllCustomTraits()
      .pipe(map(traits => traits.filter(t => !omitIds.includes(t.id))))),
    tap(traits => this.patchState(s => ({
      customTraits: this.customTraitAdapter.setAll(traits, s.customTraits)
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

  private static createGenderPreferenceAdapter() {
    return createEntityAdapter<OcGenderPreference>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.description)
    })
  }

  private static createHairStyleAdapter() {
    return createEntityAdapter<OcHairStyle>({
      selectId: e => e.id,
      sortComparer: chainSort(strSort(e => e.length), strSort(e => e.baseColor))
    })
  }

  private static createCustomTraitAdapter() {
    return createEntityAdapter<OcCustomTrait>({
      selectId: e => e.id,
      sortComparer: chainSort(strSort(e => e.label), strSort(e => e.description))
    })
  }
}
