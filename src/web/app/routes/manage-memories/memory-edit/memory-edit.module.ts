import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router'
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap'

import {ReadOnlyFieldModule} from '#components/read-only-field'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import { BaseMemoryFormComponent } from './base-memory-form/base-memory-form.component'
import {MemoryEditComponent} from './memory-edit.component';
import {MemoryEditResolve} from './memory-edit.resolve';

const ROUTES: Routes = [
  {
    path: ':memoryId',
    component: MemoryEditComponent,
    resolve: {
      storeData: MemoryEditResolve
    }
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    RxUtilPipesModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    ReadOnlyFieldModule
  ],
  declarations: [
    MemoryEditComponent,
    BaseMemoryFormComponent
  ],
  providers: [MemoryEditResolve]
})
export class MemoryEditModule {
}
