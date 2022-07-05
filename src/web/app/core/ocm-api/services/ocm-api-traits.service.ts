import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {iif, Observable} from 'rxjs'

import {
  OcBodyType,
  OcCustomTrait,
  OcEthnicity,
  OcEyeColor,
  OcGender,
  OcHairStyle,
  OcSexuality
} from '#models/traits.model'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiTraitsService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  // Body types
  getAllBodyTypes(): Observable<OcBodyType[]> {
    return this.http.get<OcBodyType[]>(this.baseUri('body-types'))
  }

  saveBodyType(trait: OcBodyType): Observable<OcBodyType> {
    return iif(
      () => !!trait.id,
      this.http.put<OcBodyType>(this.baseUri('body-types', trait.id), trait),
      this.http.post<OcBodyType>(this.baseUri('body-types'), trait)
    )
  }

  deleteBodyType(traitId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri('body-types', traitId))
  }

  // Custom traits
  getAllCustomTraits(): Observable<OcCustomTrait[]> {
    return this.http.get<OcCustomTrait[]>(this.baseUri('custom-traits'))
  }

  createCustomTrait(trait: OcCustomTrait): Observable<OcCustomTrait> {
    return iif(
      () => !!trait.id,
      this.http.put<OcCustomTrait>(this.baseUri('custom-trait', trait.id), trait),
      this.http.post<OcCustomTrait>(this.baseUri('custom-trait'), trait)
    )
  }

  deleteCustomTrait(traitId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri('custom-trait', traitId))
  }

  // Ethnicities
  getAllEthnicities(): Observable<OcEthnicity[]> {
    return this.http.get<OcEthnicity[]>(this.baseUri('ethnicities'))
  }

  saveEthnicity(trait: OcEthnicity): Observable<OcEthnicity> {
    return iif(
      () => !!trait.id,
      this.http.put<OcEthnicity>(this.baseUri('ethnicities', trait.id), trait),
      this.http.post<OcEthnicity>(this.baseUri('ethnicities'), trait)
    )
  }

  deleteEthnicity(traitId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri('ethnicities', traitId))
  }

  // Eye colors
  getAllEyeColors(): Observable<OcEyeColor[]> {
    return this.http.get<OcEyeColor[]>(this.baseUri('eye-colors'))
  }

  createEyeColor(trait: OcEyeColor): Observable<OcEyeColor> {
    return iif(
      () => !!trait.id,
      this.http.put<OcEyeColor>(this.baseUri('eye-colors', trait.id), trait),
      this.http.post<OcEyeColor>(this.baseUri('eye-colors'), trait)
    )
  }

  deleteEyeColor(): Observable<void> {
    return this.http.delete<void>(this.baseUri('eye-colors'))
  }

  // Gender preferences
  getAllGenders(): Observable<OcGender[]> {
    return this.http.get<OcGender[]>(this.baseUri('genders'))
  }

  createGender(trait: OcGender): Observable<OcGender> {
    return iif(
      () => !!trait.id,
      this.http.put<OcGender>(this.baseUri('genders', trait.id), trait),
      this.http.post<OcGender>(this.baseUri('genders'), trait)
    )
  }

  deleteGender(): Observable<void> {
    return this.http.delete<void>(this.baseUri('genders'))
  }

  // Hair styles
  getAllHairStyles(): Observable<OcHairStyle[]> {
    return this.http.get<OcHairStyle[]>(this.baseUri('hairstyles'))
  }

  createHairStyle(trait: OcHairStyle): Observable<OcHairStyle> {
    return iif(
      () => !!trait.id,
      this.http.put<OcHairStyle>(this.baseUri('hairstyles', trait.id), trait),
      this.http.post<OcHairStyle>(this.baseUri('hairstyles'), trait)
    )
  }

  deleteHairStyle(): Observable<void> {
    return this.http.delete<void>(this.baseUri('hairstyles'))
  }

  // Hair styles
  getAllSexualities(): Observable<OcSexuality[]> {
    return this.http.get<OcSexuality[]>(this.baseUri('sexualities'))
  }

  createSexuality(trait: OcSexuality): Observable<OcSexuality> {
    return iif(
      () => !!trait.id,
      this.http.put<OcSexuality>(this.baseUri('sexualities', trait.id), trait),
      this.http.post<OcSexuality>(this.baseUri('sexualities'), trait)
    )
  }

  deleteSexuality(): Observable<void> {
    return this.http.delete<void>(this.baseUri('sexualities'))
  }

  protected override baseUri(...path: string[]): string {
    return super.baseUri('traits', ...path);
  }
}
