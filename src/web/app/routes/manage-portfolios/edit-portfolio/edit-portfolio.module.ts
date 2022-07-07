import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router'

import {ReadOnlyFieldModule} from '#components/read-only-field/read-only-field.module'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import {BasePortfolioFormComponent} from './base-portfolio-form/base-portfolio-form.component'
import {EditPortfolioComponent} from './edit-portfolio.component';
import {EditPortfolioResolve} from './edit-portfolio.resolve'
import {EditPortfolioSelectionGuard} from './edit-portfolio-selection.guard';

const ROUTES: Routes = [
  {
    path: ':portfolioId',
    component: EditPortfolioComponent,
    canActivate: [EditPortfolioSelectionGuard],
    resolve: {
      storeData: EditPortfolioResolve
    }
  }
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        ReadOnlyFieldModule,
        ReactiveFormsModule,
        RxUtilPipesModule
    ],
    declarations: [
        EditPortfolioComponent,
        BasePortfolioFormComponent
    ],
    exports: [
        BasePortfolioFormComponent
    ],
    providers: [EditPortfolioSelectionGuard, EditPortfolioResolve]
})
export class EditPortfolioModule {
}
