import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {RouterModule, Routes} from '@angular/router';

import {CharacterMgmtModule} from '#components/character-mgmt'
import {TraitMgmtModule} from '#components/trait-mgmt'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import {BaseTraitFormComponent} from './base-trait-form/base-trait-form.component'
import {EditTraitComponent} from './edit-trait.component'
import {EditTraitResolve} from './edit-trait.resolve';
import {EditTraitCharactersComponent} from './edit-trait-characters/edit-trait-characters.component';

const ROUTES: Routes = [
  {
    path: ':traitId',
    component: EditTraitComponent,
    resolve: {
      storeData: EditTraitResolve
    }
  }
]

@NgModule({
  declarations: [
    EditTraitComponent,
    BaseTraitFormComponent,
    EditTraitCharactersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    RxUtilPipesModule,
    CharacterMgmtModule,
    TraitMgmtModule,
    ReactiveFormsModule
  ],
  providers: [EditTraitResolve]
})
export class EditTraitModule {
}
