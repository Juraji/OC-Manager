import {
  HttpBackend,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpXhrBackend
} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {catchError, from, iif, map, mergeMap, Observable, ObservableInput, startWith, throwError} from 'rxjs'
import {fromFetch} from 'rxjs/fetch'

@Injectable()
export class HttpFetchJsonStreamBackend implements HttpBackend {
  constructor(private xhr: HttpXhrBackend) {
  }

  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    if (!window.fetch || req.reportProgress) {
      return this.xhr.handle(req);
    }

    return this.doFetch(req).pipe(
      mergeMap(res => from(HttpFetchJsonStreamBackend.readBody(res, req.responseType))
        .pipe(
          map(body => new HttpResponse({body})),
          catchError(error => throwError(() => new HttpErrorResponse({
            error,
            status: 0,
            statusText: 'Unknown Error',
            url: req.url,
          }))),
          mergeMap(res => iif(
            () => res.ok,
            [res],
            throwError(() => new HttpErrorResponse({...res, url: req.url}))
          ))
        )),
      startWith({type: HttpEventType.Sent} as HttpSentEvent),
    );
  }

  private doFetch(req: HttpRequest<unknown>) {
    return fromFetch(req.url, {
      method: req.method,
      body: req.serializeBody(),
      headers: this.mapFromHttpHeaders(req),
      credentials: req.withCredentials ? 'include' : 'omit',
    });
  }

  private static readBody(res: Response, responseType: 'arraybuffer' | 'blob' | 'json' | 'text'): ObservableInput<unknown> {
    switch (responseType) {
      case 'json':
        if (!!res.body) return from(res.body)
          .pipe(
            map(uInt8Array => new TextDecoder().decode(uInt8Array)),
            mergeMap(s => s.trim().split(/\n/g)),
            map(s => JSON.parse(s))
          )
        else return []
      case 'blob':
        return res.blob()
      case 'arraybuffer':
        return res.arrayBuffer()
      default:
        return res.text()
    }
  }


  private mapFromHttpHeaders(req: HttpRequest<unknown>) {
    const defaultHeaders: Record<string, string> = {
      Accept: 'application/stream+json, application/json, text/plain, */*',
      'Content-Type': req.detectContentTypeHeader() || 'application/octet-stream',
    }

    return req.headers
      .keys()
      .reduce(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (headers, name) => ({...headers, [name]: req.headers.get(name)!}),
        defaultHeaders
      );
  }
}
