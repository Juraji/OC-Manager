import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {map} from 'rxjs'

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

  constructor(
    private readonly store: ImageGalleryStore
  ) {
  }

  ngOnChanges() {
    this.inputs.onChanges()
  }

}
