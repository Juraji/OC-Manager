import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, Resolve} from '@angular/router'
import {EMPTY, forkJoin, Observable} from 'rxjs'

import {PortfoliosStore} from '#core/root-store'
import {ForkJoinSource, once} from '#core/rxjs'

import {EditPortfolioStoreState} from './edit-portfolio.store'

@Injectable()
export class EditPortfolioResolve implements Resolve<EditPortfolioStoreState> {

  constructor(private readonly store: PortfoliosStore) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<EditPortfolioStoreState> {
    const portfolioId = route.paramMap.get('portfolioId')

    if (!portfolioId) {
      return EMPTY;
    } else if (portfolioId === 'new') {
      const sources: ForkJoinSource<EditPortfolioStoreState> = {
        portfolio: [null]
      }

      return forkJoin(sources)
    } else {
      const sources: ForkJoinSource<EditPortfolioStoreState> = {
        portfolio: this.store.portFolioById$(portfolioId).pipe(once())
      }

      return forkJoin(sources)
    }
  }
}
