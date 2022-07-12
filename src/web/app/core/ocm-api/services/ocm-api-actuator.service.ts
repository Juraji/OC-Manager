import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {OcmApiService} from '#core/ocm-api/services/ocm-api.service'

@Injectable()
export class OcmApiActuatorService extends OcmApiService {
  constructor(http: HttpClient) {
    super(http)
  }

  shutdown(): Observable<void> {
    return this.http.post<void>(this.baseUri('shutdown'), null)
  }

  protected override baseUri(...path:string[]): string {
    return `/actuator/${path.join('/')}`;
  }
}
