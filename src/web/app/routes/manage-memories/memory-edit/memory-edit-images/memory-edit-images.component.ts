import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Modals} from '@juraji/ng-bootstrap-modals'

import {ImageLightboxComponent} from '#components/image-lightbox/image-lightbox/image-lightbox.component'
import {OcmApiImagesService} from '#core/ocm-api'
import {OcImage} from '#models/images.model'

import {MemoryEditStore} from '../memory-edit.store'

@Component({
  selector: 'ocm-memory-edit-images',
  templateUrl: './memory-edit-images.component.html',
  styleUrls: ['./memory-edit-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryEditImagesComponent implements OnInit {

  readonly supportedFileTypes = OcmApiImagesService.SUPPORTED_FILE_TYPES

  constructor(
    private readonly modals: Modals,
    readonly store: MemoryEditStore
  ) {
  }

  ngOnInit(): void {
  }

  onSetThumbnail(e: FileList) {
    if (!!Array.from(e).find(f => f.size >= OcmApiImagesService.MAX_FILE_SIZE)) {
      this.modals.confirm('On or more of the selected files exceeds the upload limit '
        + `of ${OcmApiImagesService.MAX_FILE_SIZE_STR}. The upload is canceled.`, 'Ok')
    } else {
      this.store.addImages(e)
    }
  }

  onSetThumbnailViaFileInput(e: Event) {
    const field = e.target as HTMLInputElement
    const files = field.files

    if (!!files && files.length > 0) this.onSetThumbnail(files)
    field.value = ''
  }

  onRemoveImage(img: OcImage) {
    this.modals
      .confirm(`Are you sure you want to delete the image ${img.sourceName}?`)
      .onResolved
      .subscribe(() => this.store.removeImage(img.id))
  }

  onOpenImageLightbox(image: OcImage) {
    this.modals.open(ImageLightboxComponent, {data: {image}})
  }
}
