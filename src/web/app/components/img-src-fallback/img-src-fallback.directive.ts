import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: 'img[ocmImgSrcFallback]'
})
export class ImgSrcFallbackDirective {

  @Input()
  ocmImgSrcFallback: Nullable<string>

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
  ) {
  }

  @HostListener('error')
  onError() {
    if (!!this.ocmImgSrcFallback) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'src', this.ocmImgSrcFallback)
    }
  }
}
