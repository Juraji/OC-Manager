import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {BooleanInput} from '#core/ng-extensions'
import {
  OcBodyType,
  OcCharacterTrait,
  OcCustomTrait,
  OcEthnicity,
  OcEyeColor,
  OcGenderPreference,
  OcHairStyle
} from '#models/traits.model'

@Component({
  selector: 'ocm-trait-card',
  templateUrl: './trait-card.component.html',
  styleUrls: ['./trait-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraitCardComponent {

  @Input()
  trait: Nullable<OcCharacterTrait>

  @Input()
  @BooleanInput()
  flat: boolean | string = false;

  constructor() {
  }

  asBodyType(trait: Nullable<OcCharacterTrait>): OcBodyType {
    return trait as OcBodyType
  }

  asEthnicity(trait: Nullable<OcCharacterTrait>): OcEthnicity {
    return trait as OcEthnicity
  }

  asEyeColor(trait: Nullable<OcCharacterTrait>): OcEyeColor {
    return trait as OcEyeColor
  }

  asGenderPreference(trait: Nullable<OcCharacterTrait>): OcGenderPreference {
    return trait as OcGenderPreference
  }

  asHairStyle(trait: Nullable<OcCharacterTrait>): OcHairStyle {
    return trait as OcHairStyle
  }

  asCustomTrait(trait: Nullable<OcCharacterTrait>): OcCustomTrait {
    return trait as OcCustomTrait
  }
}
