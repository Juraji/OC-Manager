import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap'

import {DragDropFileModule} from '#components/drag-drop-file/drag-drop-file.module'
import {ImgSrcFallbackModule} from '#components/img-src-fallback'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import {BaseCharacterFormComponent} from './base-character-form/base-character-form.component'
import {CharacterEditComponent} from './character-edit.component'
import {CharacterEditResolve} from './character-edit.resolve';

const ROUTES: Routes = [
  {
    path: ':characterId',
    component: CharacterEditComponent,
    resolve: {
      storeData: CharacterEditResolve
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ImgSrcFallbackModule,
    ReactiveFormsModule,
    RxUtilPipesModule,
    NgbDatepickerModule,
    DragDropFileModule
  ],
  declarations: [
    CharacterEditComponent,
    BaseCharacterFormComponent
  ],
  providers: [
    CharacterEditResolve
  ]
})
export class CharacterEditModule {
}
