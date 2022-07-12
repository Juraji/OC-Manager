import {
  HttpBackend,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpXhrBackend
} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {catchError, from, iif, map, mergeMap, Observable, ObservableInput, startWith, throwError} from 'rxjs'
import {fromFetch} from 'rxjs/fetch'

const DEFAULT_ACCEPT_HEADER_VALUE = 'application/stream+json, application/json, text/plain, */*'

@Injectable()
export class HttpFetchJsonStreamBackend implements HttpBackend {
  constructor(private xhr: HttpXhrBackend) {
  }

  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    if (!window.fetch || req.reportProgress) {
      return this.xhr.handle(req);
    }

    return this.doFetch(req).pipe(
      mergeMap(res => from(HttpFetchJsonStreamBackend.readBody(res, req))
        .pipe(
          mergeMap(body => iif(
            () => res.ok,
            [body],
            throwError(() => new HttpErrorResponse({
              url: req.url,
              headers: HttpFetchJsonStreamBackend.fetchResponseAsNGHttpHeaders(res),
              status: res.status,
              statusText: res.statusText,
              error: body
            }))
          )),
          map(body => new HttpResponse({
            url: req.url,
            body,
            headers: HttpFetchJsonStreamBackend.fetchResponseAsNGHttpHeaders(res),
            status: res.status,
            statusText: res.statusText,
          })),
          catchError(error => throwError(() => new HttpErrorResponse({
            error,
            status: 0,
            statusText: 'Unknown Error',
            url: req.url,
          }))),
        )),
      startWith({type: HttpEventType.Sent} as HttpSentEvent),
    );
  }

  private doFetch(req: HttpRequest<unknown>) {
    const url = req.params.keys().length > 0
      ? req.url + '?' + req.params.toString()
      : req.url;

    return fromFetch(url, {
      method: req.method,
      body: req.serializeBody(),
      headers: this.mapFromHttpHeaders(req),
      credentials: req.withCredentials ? 'include' : 'omit',
    });
  }

  private static readBody(res: Response, req: HttpRequest<unknown>): ObservableInput<unknown> {
    if (req.method === 'DELETE' && !res.headers.has('Content-Type')) {
      return [null]
    }

    switch (req.responseType) {
      case 'json':
        if (!!res.body) return from(res.body)
          .pipe(
            map(uInt8Array => new TextDecoder().decode(uInt8Array)),
            mergeMap(s => s.trim().split(/\n/g)),
            map(s => JSON.parse(s)),
            mergeMap(chunk => Array.isArray(chunk) ? chunk : [chunk]),
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


  private mapFromHttpHeaders(req: HttpRequest<unknown>): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      Accept: DEFAULT_ACCEPT_HEADER_VALUE
    }

    const contentType = req.detectContentTypeHeader()
    if (!!contentType) {
      defaultHeaders['Content-Type'] = contentType
    }

    return req.headers
      .keys()
      .reduce(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (headers, name) => ({...headers, [name]: req.headers.get(name)!}),
        defaultHeaders
      );
  }

  private static fetchResponseAsNGHttpHeaders(res: Response): HttpHeaders {
    // Type hack Response.headers is actually an entry iterable, TS just doesn't expose this fact
    return new HttpHeaders(Object.fromEntries(res.headers as unknown as Iterable<[string, string]>))
  }
}
