import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MODAL_DATA, ModalScrollableDisabled, ModalSizeLg} from '@juraji/ng-bootstrap-modals'

import {OcmApiImagesService} from '#core/ocm-api'
import {OcImage} from '#models/images.model'

interface ImageLightboxData {
  image: OcImage
}

@ModalSizeLg()
@ModalScrollableDisabled()
@Component({
  templateUrl: './image-lightbox.component.html',
  styleUrls: ['./image-lightbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageLightboxComponent implements OnInit {

  readonly image: OcImage;
  readonly imageUri: Nullable<string>

  constructor(
    private readonly imagesService: OcmApiImagesService,
    @Inject(MODAL_DATA) private readonly data: ImageLightboxData,
  ) {
    this.image = data.image
    this.imageUri = this.imagesService.getImageSourceUrlById(data.image.id)
  }

  ngOnInit(): void {
  }

}
