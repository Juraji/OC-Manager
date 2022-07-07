import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const ROUTES: Routes = [
  {
    path: '**',
    redirectTo: '../edit/new'
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: []
})
export class MemoriesOverviewModule {
}
