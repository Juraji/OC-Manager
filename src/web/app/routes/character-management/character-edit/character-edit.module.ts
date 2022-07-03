import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap'

import {ImgSrcFallbackModule} from '#components/img-src-fallback'
import {RxUtilPipesModule} from '#components/rx-util-pipes/rx-util-pipes.module'

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
    NgbDatepickerModule,
    RxUtilPipesModule
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
