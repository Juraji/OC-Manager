import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from '#environment'

@Injectable()
export class OcmApiBaseUriInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = !request.url.startsWith('http')
      ? request.clone({url: `${environment.apiHost}${request.url}`})
      : request

    return next.handle(req);
  }
}
