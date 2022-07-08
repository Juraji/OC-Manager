import {CommonModule} from '@angular/common'
import {HttpClientModule} from '@angular/common/http'
import {ModuleWithProviders, NgModule} from '@angular/core'

import {OcmApiImagesService} from '#core/ocm-api/services/ocm-api-images.service'

import {OcmApiCharacterMemoriesService} from './services/ocm-api-character-memories.service'
import {OcmApiCharacterRelationshipsService} from './services/ocm-api-character-relationships.service'
import {OcmApiCharacterTraitsService} from './services/ocm-api-character-traits.service'
import {OcmApiCharactersService} from './services/ocm-api-characters.service'
import {OcmApiMemoriesService} from './services/ocm-api-memories.service'
import {OcmApiPortfoliosService} from './services/ocm-api-portfolios.service'
import {OcmApiSettingsService} from './services/ocm-api-settings.service'


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ]
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
        OcmApiImagesService
      ]
    }
  }
}
