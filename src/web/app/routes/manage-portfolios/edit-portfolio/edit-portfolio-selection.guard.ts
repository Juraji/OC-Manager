import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';

import {PortfoliosStore} from '#core/root-store'

@Injectable()
export class EditPortfolioSelectionGuard implements CanActivate {
  constructor(private readonly store: PortfoliosStore) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const portfolioId = route.paramMap.get('portfolioId')

    if (!!portfolioId) {
      this.store.setSelectedPortfolioById(portfolioId)
      return true;
    }

    return false;
  }
}
