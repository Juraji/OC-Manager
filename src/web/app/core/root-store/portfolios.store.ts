import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {defaultIfEmpty, map, mergeMap, Observable, tap} from 'rxjs'

import {booleanSort, chainSort, strSort} from '#core/arrays'
import {OcmApiPortfoliosService} from '#core/ocm-api'
import {filterNotNull, once} from '#core/rxjs'
import {OcPortfolio} from '#models/portfolios.model'

interface PortfoliosStoreState {
  portfolios: EntityState<OcPortfolio>
  selectedPortfolioId: Nullable<string>
  defaultPortfolioId: Nullable<string>
}

@Injectable()
export class PortfoliosStore extends ComponentStore<PortfoliosStoreState> {

  private readonly portfolioAdapter = PortfoliosStore.createPortfolioAdapter()
  private readonly portfolioSelectors = this.portfolioAdapter.getSelectors()

  public readonly portfolios$: Observable<OcPortfolio[]> = this
    .select(s => s.portfolios)
    .pipe(map(this.portfolioSelectors.selectAll))

  public readonly selectedPortfolioId$: Observable<Nullable<string>> = this
    .select(s => s.selectedPortfolioId)

  public readonly portFolioById$: (id: string) => Observable<OcPortfolio | null> = (id: string) => this
    .select(s => s.portfolios)
    .pipe(
      map(this.portfolioSelectors.selectEntities),
      map(pfs => pfs[id] ?? null)
    )

  constructor(
    private readonly service: OcmApiPortfoliosService,
  ) {
    super()

    this.setState({
      portfolios: this.portfolioAdapter.getInitialState(),
      selectedPortfolioId: null,
      defaultPortfolioId: null
    })
  }

  initialize(): Observable<OcPortfolio[]> {
    return this.service
      .getAllPortfolios()
      .pipe(tap(pfs => {
        const defaultPortfolioId = pfs.find(p => p.default)?.id
        this.setState(s => ({
          portfolios: this.portfolioAdapter.setAll(pfs, s.portfolios),
          selectedPortfolioId: defaultPortfolioId,
          defaultPortfolioId
        }))
      }))
  }

  readonly setSelectedPortfolioById: (portfolioId: string) => void = this.effect<string>($ => $.pipe(
    tap(selectedPortfolioId => this.patchState({selectedPortfolioId}))
  ))

  savePortFolio(portfolio: Partial<OcPortfolio>): Observable<OcPortfolio> {
    return this.portFolioById$(portfolio.id ?? '')
      .pipe(
        once(),
        filterNotNull(),
        defaultIfEmpty({} as OcPortfolio),
        map(p => ({...p, ...portfolio})),
        mergeMap(p => this.service.savePortfolio(p)),
        tap(p => this.patchState(s => ({
          portfolios: this.portfolioAdapter.upsertOne(p, s.portfolios),
        })))
      )
  }

  deletePortFolio(portfolioId: string): Observable<void> {
    return this.service
      .deletePortfolio(portfolioId)
      .pipe(tap(() => this.patchState(s => ({
        portfolios: this.portfolioAdapter.removeOne(portfolioId, s.portfolios),
        selectedPortfolioId: portfolioId === s.selectedPortfolioId
          ? s.defaultPortfolioId
          : s.selectedPortfolioId
      }))))
  }

  private static createPortfolioAdapter() {
    return createEntityAdapter<OcPortfolio>({
      selectId: e => e.id,
      sortComparer: chainSort(strSort(e => e.name), booleanSort(e => e.default))
    })
  }
}
