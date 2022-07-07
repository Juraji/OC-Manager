import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router'
import {ModalsModule} from '@juraji/ng-bootstrap-modals'

import {ImgSrcFallbackModule} from '../img-src-fallback'
import {CharacterCardComponent} from './character-card/character-card.component';


@NgModule({
  imports: [
    CommonModule,
    ModalsModule,
    ImgSrcFallbackModule,
    RouterModule
  ],
  declarations: [
    CharacterCardComponent,
  ],
  exports: [
    CharacterCardComponent
  ]
})
export class CharacterMgmtModule {
}
