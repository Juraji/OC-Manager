import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap'

import {DragDropFileModule} from '#components/drag-drop-file'
import {ImgSrcFallbackModule} from '#components/img-src-fallback'
import {RelationshipMgmtModule} from '#components/relationship-mgmt'
import {TraitMgmtModule} from '#components/trait-mgmt'
import {DatePipesModule} from '#core/date-pipes'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import {BaseCharacterFormComponent} from './base-character-form/base-character-form.component'
import {CharacterEditComponent} from './character-edit.component'
import {CharacterEditResolve} from './character-edit.resolve';
import {CharacterEventMgmtComponent} from './character-event-mgmt/character-event-mgmt.component';
import {CharacterRelationshipMgmtComponent} from './character-relationship-mgmt/character-relationship-mgmt.component';
import {CharacterTraitMgmtComponent} from './character-trait-mgmt/character-trait-mgmt.component';

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
    DragDropFileModule,
    DatePipesModule,
    RelationshipMgmtModule,
    TraitMgmtModule
  ],
  declarations: [
    CharacterEditComponent,
    BaseCharacterFormComponent,
    CharacterTraitMgmtComponent,
    CharacterRelationshipMgmtComponent,
    CharacterEventMgmtComponent
  ],
  providers: [
    CharacterEditResolve
  ]
})
export class CharacterEditModule {
}
