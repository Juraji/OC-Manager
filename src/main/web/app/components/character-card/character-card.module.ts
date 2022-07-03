import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ImgFallbackModule} from 'ngx-img-fallback'

import {CharacterCardComponent} from './character-card/character-card.component';


@NgModule({
  imports: [
    CommonModule,
    ImgFallbackModule
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
