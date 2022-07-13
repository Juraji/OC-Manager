import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {OcmApiService} from '#core/ocm-api/services/ocm-api.service'
import {OcImage, OcImageGalleryView} from '#models/images.model'

@Injectable()
export class OcmApiImagesService extends OcmApiService {
  public static readonly SUPPORTED_FILE_TYPES = 'image/jpeg,image/png,image/gif,image/tiff'
  public static readonly MAX_FILE_SIZE = 15728640
  public static readonly MAX_FILE_SIZE_STR = '15mb'

  constructor(http: HttpClient) {
    super(http)
  }

  getImagesByLinkedNodeId(linkedNodeId: string): Observable<OcImage> {
    return this.http.get<OcImage>(this.baseUri(), {params: {linkedNodeId}})
  }

  getImagesAsGalleryViews(): Observable<OcImageGalleryView> {
    return this.http.get<OcImageGalleryView>(this.baseUri('gallery'))
  }

  getImageThumbnailUrlById(imageId: string): string {
    return this.baseUri(imageId, 'thumbnail')
  }

  getImageSourceUrlById(imageId: string): string {
    return this.baseUri(imageId, 'source')
  }

  saveImage(file: File, linkToNodeId: string,): Observable<OcImage> {
    const fd = new FormData()
    fd.set('file', file, file.name)

    return this.http.post<OcImage>(this.baseUri(), fd, {params: {linkToNodeId}})
  }

  deleteImage(imageId: string): Observable<void> {
    return this.http.delete<void>(this.baseUri(imageId))
  }

  protected override baseUri(...path: string[]): string {
    return super.baseUri('images', ...path);
  }
}
