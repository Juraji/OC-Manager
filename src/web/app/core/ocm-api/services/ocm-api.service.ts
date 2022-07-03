import {HttpClient} from '@angular/common/http'

import {environment} from '#environment'

export abstract class OcmApiService {

  protected constructor(protected readonly http: HttpClient) {
  }

  protected baseUri(...path: string[]): string {
    const baseUri = environment.apiBaseUri
    return `${baseUri}/${path.join('/')}`
  }
}
