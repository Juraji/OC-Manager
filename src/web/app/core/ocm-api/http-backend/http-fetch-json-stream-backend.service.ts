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
  private readonly textDecoder = new TextDecoder()

  constructor(private xhr: HttpXhrBackend) {
  }

  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    if (!window.fetch || req.reportProgress) {
      return this.xhr.handle(req);
    }

    return this.doFetch(req).pipe(
      mergeMap(res => from(this.readBody(res, req))
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
      headers: this.ngHttpHeadersToFetchHeaders(req),
      credentials: req.withCredentials ? 'include' : 'omit',
    });
  }

  private readBody(res: Response, req: HttpRequest<unknown>): ObservableInput<unknown> {
    if (!res.headers.has('Content-Type')) {
      return [null]
    }

    switch (req.responseType) {
      case 'json':
        if (!!res.body) return from(res.body)
          .pipe(
            map(uInt8Array => this.textDecoder.decode(uInt8Array)),
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


  private ngHttpHeadersToFetchHeaders(req: HttpRequest<unknown>): Headers {
    const resultHeaders = new Headers()
    resultHeaders.set('Accept', DEFAULT_ACCEPT_HEADER_VALUE)

    const contentType = req.detectContentTypeHeader()
    if (!!contentType) resultHeaders.set('Content-Type', contentType)

    req.headers
      .keys()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .forEach(k => resultHeaders.set(k, req.headers.get(k)!))

    return resultHeaders
  }

  private static fetchResponseAsNGHttpHeaders(res: Response): HttpHeaders {
    // Type hack Response.headers is actually an entry iterable, TS just doesn't expose this fact
    return new HttpHeaders(Object.fromEntries(res.headers as unknown as Iterable<[string, string]>))
  }
}
