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
  selectedPortfolio: Nullable<OcPortfolio>
  defaultPortfolio: Nullable<OcPortfolio>
}

@Injectable()
export class PortfoliosStore extends ComponentStore<PortfoliosStoreState> {

  private readonly portfolioAdapter = PortfoliosStore.createPortfolioAdapter()
  private readonly portfolioSelectors = this.portfolioAdapter.getSelectors()

  public readonly portfolios$: Observable<OcPortfolio[]> = this
    .select(s => s.portfolios)
    .pipe(map(this.portfolioSelectors.selectAll))

  public readonly portFolioById$: (id: string) => Observable<OcPortfolio | null> = (id: string) => this
    .select(s => s.portfolios)
    .pipe(
      map(this.portfolioSelectors.selectEntities),
      map(pfs => pfs[id] ?? null)
    )

  public readonly selectedPortfolio$ = this.select(s => s.selectedPortfolio)

  public readonly selectedPortfolioId$: Observable<Nullable<string>> = this.selectedPortfolio$
    .pipe(map(p => p?.id))

  constructor(
    private readonly service: OcmApiPortfoliosService,
  ) {
    super()

    this.setState({
      portfolios: this.portfolioAdapter.getInitialState(),
      selectedPortfolio: null,
      defaultPortfolio: null
    })
  }

  initialize(): Observable<OcPortfolio[]> {
    return this.service
      .getAllPortfolios()
      .pipe(tap(pfs => {
        const defaultPortfolio = pfs.find(p => p.default)
        this.setState(s => ({
          portfolios: this.portfolioAdapter.setAll(pfs, s.portfolios),
          selectedPortfolio: defaultPortfolio,
          defaultPortfolio
        }))
      }))
  }

  readonly setSelectedPortfolioById: (portfolioId: string) => void = this.effect<string>($ => $.pipe(
    mergeMap(id => this.portFolioById$(id)),
    once(),
    filterNotNull(),
    tap(selectedPortfolio => this.patchState({selectedPortfolio}))
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
        selectedPortfolioId: portfolioId === s.selectedPortfolio?.id
          ? s.defaultPortfolio
          : s.selectedPortfolio
      }))))
  }

  private static createPortfolioAdapter() {
    return createEntityAdapter<OcPortfolio>({
      selectId: e => e.id,
      sortComparer: chainSort(booleanSort(e => e.default), strSort(e => e.name))
    })
  }
}
