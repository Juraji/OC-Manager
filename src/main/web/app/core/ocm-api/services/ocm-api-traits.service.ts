import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {iif, Observable} from 'rxjs'

import {OcmApiService} from '#core/ocm-api/services/ocm-api.service'
import {OcBodyType, OcEthnicity, OcEyeColor, OcGenderPreference, OcHairStyle} from '#models/traits.model'

@Injectable()
export class OcmApiTraitsService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  // Body types
  getAllBodyTypes(): Observable<OcBodyType> {
    return this.http.get<OcBodyType>(this.baseUri('body-types'))
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

  // Ethnicities
  getAllEthnicities(): Observable<OcEthnicity> {
    return this.http.get<OcEthnicity>(this.baseUri('ethnicities'))
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
  getAllEyeColors(): Observable<OcEyeColor> {
    return this.http.get<OcEyeColor>(this.baseUri('eye-colors'))
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
  getAllGenderPreferences(): Observable<OcGenderPreference> {
    return this.http.get<OcGenderPreference>(this.baseUri('gender-preferences'))
  }

  createGenderPreference(trait: OcGenderPreference): Observable<OcGenderPreference> {
    return iif(
      () => !!trait.id,
      this.http.put<OcGenderPreference>(this.baseUri('gender-preferences', trait.id), trait),
      this.http.post<OcGenderPreference>(this.baseUri('gender-preferences'), trait)
    )
  }

  deleteGenderPreference(): Observable<void> {
    return this.http.delete<void>(this.baseUri('gender-preferences'))
  }

  // Hair styles
  getAllHairStyles(): Observable<OcHairStyle> {
    return this.http.get<OcHairStyle>(this.baseUri('hairstyles'))
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

  protected override baseUri(...path: string[]): string {
    return super.baseUri('traits', ...path);
  }
}
