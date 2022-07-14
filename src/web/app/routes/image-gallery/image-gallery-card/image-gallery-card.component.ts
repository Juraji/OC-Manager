import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {Modals} from '@juraji/ng-bootstrap-modals'
import {map} from 'rxjs'

import {ImageLightboxComponent} from '#components/image-lightbox/image-lightbox/image-lightbox.component'
import {filterNotNull, ObservableInputs} from '#core/rxjs'
import {OcImageGalleryView} from '#models/images.model'

import {ImageGalleryStore} from '../image-gallery/image-gallery.store'

@Component({
  selector: 'ocm-image-gallery-card',
  templateUrl: './image-gallery-card.component.html',
  styleUrls: ['./image-gallery-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGalleryCardComponent implements OnChanges {
  private readonly inputs = new ObservableInputs()

  @Input()
  image: Nullable<OcImageGalleryView>
  readonly image$ = this.inputs.observe(() => this.image)

  readonly thumbnailUri$ = this.image$.pipe(
    filterNotNull(),
    map(img => this.store.getImageThumbnailUrlById(img.id))
  )
  readonly imageCardLink$ = this.image$.pipe(
    filterNotNull(),
    map(img => ImageGalleryCardComponent.imageNodeLink(img))
  )

  constructor(
    private readonly store: ImageGalleryStore,
    private readonly modals: Modals,
  ) {
  }

  ngOnChanges() {
    this.inputs.onChanges()
  }

  private static imageNodeLink(img: OcImageGalleryView) {
    for (const label of img.parentNodeLabels) {
      switch (label) {
        case 'OcCharacter':
          return ['/characters/edit', img.parentNodeId];
        case 'OcMemory':
          return ['/memories/edit', img.parentNodeId];
      }
    }

    return ['.']
  }

  onOpenImageLightbox() {
    this.modals.open(ImageLightboxComponent, {data: {image: this.image}})
  }
}
