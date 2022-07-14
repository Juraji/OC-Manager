import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ModalsModule} from '@juraji/ng-bootstrap-modals'

import {ImgSrcFallbackModule} from '#components/img-src-fallback'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
import { ImageGalleryCardComponent } from './image-gallery-card/image-gallery-card.component'

const ROUTES: Routes = [
  {
    path: 'gallery',
    component: ImageGalleryComponent
  },
  {
    path: '**',
    redirectTo: 'gallery'
  }
]

@NgModule({
  declarations: [
    ImageGalleryComponent,
    ImageGalleryCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ModalsModule,
    RxUtilPipesModule,
    ImgSrcFallbackModule,
  ]
})
export class ImageGalleryModule {
}
