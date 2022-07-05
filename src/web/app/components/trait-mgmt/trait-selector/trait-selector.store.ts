import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, tap} from 'rxjs'

import {chainSort, strSort} from '#core/arrays'
import {OcmApiTraitsService} from '#core/ocm-api'
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

  public allBodyTypes$ = this
    .select(s => s.bodyTypes)
    .pipe(map(this.bodyTypeSelectors.selectAll))

  public allEthnicities$ = this
    .select(s => s.ethnicities)
    .pipe(map(this.ethnicitySelectors.selectAll))

  public allEyeColors$ = this
    .select(s => s.eyeColors)
    .pipe(map(this.eyeColorSelectors.selectAll))

  public allGender$ = this
    .select(s => s.genders)
    .pipe(map(this.genderSelectors.selectAll))

  public allHairStyles$ = this
    .select(s => s.hairStyles)
    .pipe(map(this.hairStyleSelectors.selectAll))

  public allCustomTraits$ = this
    .select(s => s.customTraits)
    .pipe(map(this.customTraitSelectors.selectAll))

  public allSexualities$ = this
    .select(s => s.sexualities)
    .pipe(map(this.sexualitySelectors.selectAll))

  constructor(
    private readonly service: OcmApiTraitsService,
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

    this.loadTraits()
  }

  loadTraits(omitTraitIds: string[] = []) {
    this.loadBodyTypes(omitTraitIds)
    this.loadEthnicities(omitTraitIds)
    this.loadEyeColors(omitTraitIds)
    this.loadGenders(omitTraitIds)
    this.loadHairStyles(omitTraitIds)
    this.loadCustomTraits(omitTraitIds)
    this.loadSexualities(omitTraitIds)
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

  private readonly loadGenders = this.effect<string[]>($ => $.pipe(
    mergeMap(omitIds => this.service
      .getAllGenders()
      .pipe(map(traits => traits.filter(t => !omitIds.includes(t.id))))),
    tap(traits => this.patchState(s => ({
      genders: this.genderAdapter.setAll(traits, s.genders)
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

  private readonly loadSexualities = this.effect<string[]>($ => $.pipe(
    mergeMap(omitIds => this.service
      .getAllSexualities()
      .pipe(map(traits => traits.filter(t => !omitIds.includes(t.id))))),
    tap(traits => this.patchState(s => ({
      sexualities: this.sexualityAdapter.setAll(traits, s.sexualities)
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
      sortComparer: chainSort(strSort(e => e.length), strSort(e => e.baseColor))
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
