import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, tap} from 'rxjs'

import {numberSort} from '#core/arrays'
import {OcmApiImagesService} from '#core/ocm-api'
import {OcImageGalleryView} from '#models/images.model'

interface ImageGalleryStoreState {
  images: EntityState<OcImageGalleryView>
}

@Injectable()
export class ImageGalleryStore extends ComponentStore<ImageGalleryStoreState> {

  private readonly imageAdapter = ImageGalleryStore.createImageAdapter()
  private readonly imageSelectors = this.imageAdapter.getSelectors()

  readonly images$: Observable<OcImageGalleryView[]> = this
    .select(s => s.images)
    .pipe(map(this.imageSelectors.selectAll))

  constructor(
    private readonly service: OcmApiImagesService
  ) {
    super()

    this.setState({
      images: this.imageAdapter.getInitialState()
    })
  }

  readonly loadImages: () => void = this.effect<void>($ => $.pipe(
    tap(() => this.patchState(s => ({
      images: this.imageAdapter.removeAll(s.images)
    }))),
    mergeMap(() => this.service.getImagesAsGalleryViews()),
    tap(img => this.patchState(s => ({
      images: this.imageAdapter.addOne(img, s.images)
    })))
  ))

  getImageThumbnailUrlById(id: string) {
    return this.service.getImageThumbnailUrlById(id)
  }

  private static createImageAdapter() {
    return createEntityAdapter<OcImageGalleryView>({
      selectId: e => e.id,
      sortComparer: numberSort(e => e.uploadedOn)
    })
  }
}
