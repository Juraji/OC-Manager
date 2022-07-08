import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router'
import {NgbDatepickerModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap'

import {CharacterMgmtModule} from '#components/character-mgmt'
import {DragDropFileModule} from '#components/drag-drop-file'
import {ImgSrcFallbackModule} from '#components/img-src-fallback'
import {ReadOnlyFieldModule} from '#components/read-only-field'
import {DatePipesModule} from '#core/date-pipes'
import {OcmApiModule} from '#core/ocm-api'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import { BaseMemoryFormComponent } from './base-memory-form/base-memory-form.component'
import {MemoryEditComponent} from './memory-edit.component';
import {MemoryEditResolve} from './memory-edit.resolve';
import { MemoryEditCharactersComponent } from './memory-edit-characters/memory-edit-characters.component';
import { MemoryEditImagesComponent } from './memory-edit-images/memory-edit-images.component';

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
    ReadOnlyFieldModule,
    DatePipesModule,
    CharacterMgmtModule,
    NgbDropdownModule,
    DragDropFileModule,
    ImgSrcFallbackModule,
    OcmApiModule
  ],
  declarations: [
    MemoryEditComponent,
    BaseMemoryFormComponent,
    MemoryEditCharactersComponent,
    MemoryEditImagesComponent
  ],
  providers: [MemoryEditResolve]
})
export class MemoryEditModule {
}
