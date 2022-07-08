import {Pipe, PipeTransform} from '@angular/core';

import {OcmApiImagesService} from '#core/ocm-api/services/ocm-api-images.service'
import {OcImage} from '#models/images.model'

@Pipe({name: 'sourceImgUrl'})
export class SourceImgUrlPipe implements PipeTransform {

  constructor(
    private readonly service: OcmApiImagesService
  ) {
  }

  transform(image: Nullable<OcImage | string>): Nullable<string> {
    if (!image) return null
    return this.service.getImageSourceUrlById(typeof image === 'string' ? image : image.id)
  }

}
