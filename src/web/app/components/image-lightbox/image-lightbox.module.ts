import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ModalsModule} from '@juraji/ng-bootstrap-modals'

import {ImgSrcFallbackModule} from '#components/img-src-fallback'

import {ImageLightboxComponent} from './image-lightbox/image-lightbox.component';


@NgModule({
  imports: [
    CommonModule,
    ModalsModule,
    ImgSrcFallbackModule,
  ],
  declarations: [
    ImageLightboxComponent
  ],
  exports: [
    ImageLightboxComponent
  ]
})
export class ImageLightboxModule {
}
