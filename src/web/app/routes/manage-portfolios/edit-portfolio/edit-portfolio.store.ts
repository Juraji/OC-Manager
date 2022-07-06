import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {defaultIfEmpty, map, mergeMap, Observable, tap} from 'rxjs'

import {PortfoliosStore} from '#core/root-store'
import {filterNotNull, once} from '#core/rxjs'
import {OcPortfolio} from '#models/portfolios.model'

export interface EditPortfolioStoreState {
  portfolio: Nullable<OcPortfolio>
}

@Injectable()
export class EditPortfolioStore extends ComponentStore<EditPortfolioStoreState> {

  public readonly portfolioId$: Observable<string | null> = this.select(s => s.portfolio?.id ?? null)
  public readonly isNewPortfolio$: Observable<boolean> = this.portfolioId$.pipe(map(id => !id))
  public readonly portfolio$: Observable<OcPortfolio> = this
    .select(s => s.portfolio)
    .pipe(filterNotNull())

  constructor(
    private readonly portfoliosStore: PortfoliosStore
  ) {
    super({
      portfolio: null
    })
  }

  readonly setStoreData: (sd: EditPortfolioStoreState) => void = this
    .effect<EditPortfolioStoreState>($ => $.pipe(
      tap(s => this.setState(s))
    ))

  savePortFolio(changes: Partial<OcPortfolio>): Observable<OcPortfolio> {
    return this.portfolioId$
      .pipe(
        once(),
        mergeMap(id => !!id ? this.portfolio$ : [{} as OcPortfolio]),
        once(),
        defaultIfEmpty({} as OcPortfolio),
        map(portfolio => ({...portfolio, ...changes})),
        mergeMap(character => this.portfoliosStore.savePortFolio(character)),
        tap(portfolio => this.patchState({portfolio}))
      )
  }

  deletePortFolio(): Observable<void> {
    return this.portfolioId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.portfoliosStore.deletePortFolio(id))
      )
  }
}
