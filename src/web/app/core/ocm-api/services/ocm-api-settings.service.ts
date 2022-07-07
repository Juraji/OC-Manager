import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {OcmApiService} from '#core/ocm-api/services/ocm-api.service'
import {OcSettings} from '#models/settings.model'

@Injectable()
export class OcmApiSettingsService extends OcmApiService {
  constructor(http: HttpClient) {
    super(http)
  }

  getEventSettings(): Observable<OcSettings> {
    return this.http.get<OcSettings>(this.baseUri())
  }

  updateEventSettings(settings: OcSettings): Observable<OcSettings> {
    return this.http.put<OcSettings>(this.baseUri(), settings)
  }

  protected override baseUri(...path: string[]): string {
    return super.baseUri('settings', ...path);
  }
}
