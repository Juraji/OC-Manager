import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {OcmApiImagesService} from '#core/ocm-api'

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
    readonly store: MemoryEditStore
  ) {
  }

  ngOnInit(): void {
  }

  onSetThumbnail(e: FileList) {
    this.store.addImages(e)
  }

  onSetThumbnailViaFileInput(e: Event) {
    const field = e.target as HTMLInputElement
    const files = field.files
    field.value = ''

    if (!!files && files.length > 0) this.onSetThumbnail(files)
  }
}
