import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {iif, Observable} from 'rxjs'

import {OcPortfolio} from '#models/portfolios.model'

import {OcmApiService} from './ocm-api.service'

@Injectable()
export class OcmApiPortfoliosService extends OcmApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getAllPortfolios(): Observable<OcPortfolio[]> {
    return this.http.get<OcPortfolio[]>(this.baseUri())
  }

  getPortfolioById(portfolioId: string): Observable<OcPortfolio> {
    return this.http.get<OcPortfolio>(this.baseUri(portfolioId))
  }

  savePortfolio(portfolio: OcPortfolio): Observable<OcPortfolio> {
    return iif(
      () => !!portfolio.id,
      this.http.put<OcPortfolio>(this.baseUri(portfolio.id), portfolio),
      this.http.post<OcPortfolio>(this.baseUri(), portfolio)
    )
  }

  deletePortfolio(portfolioId: string) {
    return this.http.delete<void>(this.baseUri(portfolioId))
  }

  protected override baseUri(...path: string[]): string {
    return super.baseUri('portfolios', ...path);
  }
}
