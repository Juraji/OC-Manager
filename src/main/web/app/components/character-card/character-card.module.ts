import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ImgFallbackModule} from 'ngx-img-fallback'

import {CharacterCardComponent} from './character-card/character-card.component';
import {ImgSrcFallbackModule} from '#components/img-src-fallback'
import {RouterModule} from '@angular/router'


@NgModule({
  imports: [
    CommonModule,
    ImgFallbackModule,
    ImgSrcFallbackModule,
    RouterModule
  ],
  declarations: [
    CharacterCardComponent
  ],
  exports: [
    CharacterCardComponent
  ]
})
export class CharacterCardModule {
}
