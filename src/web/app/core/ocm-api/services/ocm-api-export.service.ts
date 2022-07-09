import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {map, Observable} from 'rxjs'
import {tap} from 'rxjs/operators'

import {saveBlobAs} from '#core/files'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiExportService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  exportCharacters(): Observable<null> {
    return this.getAsFile(this.baseUri('characters'), 'characters.csv')
  }


  protected override baseUri(...path: string[]): string {
    return super.baseUri('export', ...path);
  }

  private getAsFile(uri: string, defaultFileName: string): Observable<null> {
    return this.http.get(uri, {observe: 'response', responseType: 'blob'})
      .pipe(
        tap(({body, headers}) => {
          if (!!body) {
            let fileName = defaultFileName

            if (headers.has('content-disposition')) {
              const disposition = headers.get('content-disposition') || '';
              const fileNamePrefix = 'filename="';

              if (disposition.indexOf(fileNamePrefix) > -1) {
                fileName = disposition.substring(
                  disposition.indexOf(fileNamePrefix) + fileNamePrefix.length,
                  disposition.length - 1
                );
              }
            }

            saveBlobAs(body, fileName)
          }
        }),
        map(() => null)
      )
  }
}
