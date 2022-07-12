import {CommonModule} from '@angular/common'
import {HTTP_INTERCEPTORS, HttpBackend, HttpClientModule} from '@angular/common/http'
import {ModuleWithProviders, NgModule} from '@angular/core'

import {HttpFetchJsonStreamBackend} from '#core/ocm-api/http-backend/http-fetch-json-stream-backend.service'
import {OcmApiBaseUriInterceptor} from '#core/ocm-api/interceptors/ocm-api-base-uri.interceptor'
import {OcmApiActuatorService} from '#core/ocm-api/services/ocm-api-actuator.service'
import {OcmApiExportService} from '#core/ocm-api/services/ocm-api-export.service'
import {OcmApiImagesService} from '#core/ocm-api/services/ocm-api-images.service'

import {OcmApiCharacterMemoriesService} from './services/ocm-api-character-memories.service'
import {OcmApiCharacterRelationshipsService} from './services/ocm-api-character-relationships.service'
import {OcmApiCharacterTraitsService} from './services/ocm-api-character-traits.service'
import {OcmApiCharactersService} from './services/ocm-api-characters.service'
import {OcmApiMemoriesService} from './services/ocm-api-memories.service'
import {OcmApiPortfoliosService} from './services/ocm-api-portfolios.service'
import {OcmApiSettingsService} from './services/ocm-api-settings.service';
import {SourceImgUrlPipe} from './source-img-url.pipe'
import {ThumbnailImgUrlPipe} from './thumbnail-img-url.pipe';


@NgModule({
  declarations: [
    ThumbnailImgUrlPipe,
    SourceImgUrlPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    ThumbnailImgUrlPipe,
    SourceImgUrlPipe
  ],
})
export class OcmApiModule {
  static forRoot(): ModuleWithProviders<OcmApiModule> {
    return {
      ngModule: OcmApiModule,
      providers: [
        OcmApiCharacterMemoriesService,
        OcmApiCharacterRelationshipsService,
        OcmApiCharacterTraitsService,
        OcmApiCharactersService,
        OcmApiMemoriesService,
        OcmApiPortfoliosService,
        OcmApiSettingsService,
        OcmApiImagesService,
        OcmApiExportService,
        OcmApiActuatorService,
        HttpFetchJsonStreamBackend,
        {provide: HttpBackend, useExisting: HttpFetchJsonStreamBackend},
        {provide: HTTP_INTERCEPTORS, useClass: OcmApiBaseUriInterceptor, multi: true}
      ]
    }
  }
}
