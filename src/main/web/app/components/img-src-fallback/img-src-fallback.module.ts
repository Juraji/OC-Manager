import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImgSrcFallbackDirective} from './img-src-fallback.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ImgSrcFallbackDirective],
  exports: [ImgSrcFallbackDirective]
})
export class ImgSrcFallbackModule {
}
