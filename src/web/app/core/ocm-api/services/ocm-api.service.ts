import {HttpClient} from '@angular/common/http'

export abstract class OcmApiService {

  protected constructor(protected readonly http: HttpClient) {
  }

  protected baseUri(...path: string[]): string {
    return `/api/${path.join('/')}`
  }
}
