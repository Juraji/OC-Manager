import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, mergeMap, Observable} from 'rxjs';

import {PortfoliosStore} from '#core/root-store/portfolios.store'
import {once} from '#core/rxjs'

const HEADER_PORTFOLIO = 'X-OC-Context-Portfolio'

@Injectable()
export class PortfolioHeaderInterceptor implements HttpInterceptor {

  constructor(
    private readonly store: PortfoliosStore,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.selectedPortfolioId$
      .pipe(
        once(),
        map(portfolioId => !!portfolioId
          ? request.clone({setHeaders: {[HEADER_PORTFOLIO]: portfolioId}})
          : request),
        mergeMap(r => next.handle(r))
      )
  }
}
