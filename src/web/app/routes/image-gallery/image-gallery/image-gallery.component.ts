import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {ImageGalleryStore} from './image-gallery.store'

@Component({
  selector: 'ocm-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ImageGalleryStore]
})
export class ImageGalleryComponent implements OnInit {

  constructor(
    readonly store: ImageGalleryStore,
  ) {
  }

  ngOnInit(): void {
    this.store.loadImages()
  }

}
