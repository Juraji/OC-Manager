import {CommonModule} from '@angular/common'
import {HttpClientModule} from '@angular/common/http'
import {ModuleWithProviders, NgModule} from '@angular/core'

import {OcmApiCharacterEventsService} from './services/ocm-api-character-events.service'
import {OcmApiCharacterRelationshipsService} from './services/ocm-api-character-relationships.service'
import {OcmApiCharacterTraitsService} from './services/ocm-api-character-traits.service'
import {OcmApiCharactersService} from './services/ocm-api-characters.service'
import {OcmApiEventsService} from './services/ocm-api-events.service'


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
})
export class OcmApiModule {
  static forRoot(): ModuleWithProviders<OcmApiModule> {
    return {
      ngModule: OcmApiModule,
      providers: [
        OcmApiCharacterEventsService,
        OcmApiCharacterRelationshipsService,
        OcmApiCharacterTraitsService,
        OcmApiCharactersService,
        OcmApiEventsService,
      ]
    }
  }
}
