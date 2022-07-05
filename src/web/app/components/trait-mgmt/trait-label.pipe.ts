import {TitleCasePipe} from '@angular/common'
import {Pipe, PipeTransform} from '@angular/core';

import {
  OcBodyType,
  OcCharacterTrait,
  OcCustomTrait,
  OcEthnicity,
  OcEyeColor,
  OcGender,
  OcHairStyle, OcSexuality
} from '#models/traits.model'

abstract class TraitRenderer<T extends OcCharacterTrait> {
  constructor(private readonly titleCasePipe: TitleCasePipe) {
  }

  abstract typeLabel(t: T): string

  abstract render(t: T): string

  protected titleCase(s: string): string {
    return this.titleCasePipe.transform(s);
  }
}

class OcBodyTypeRenderer extends TraitRenderer<OcBodyType> {
  readonly typeLabel = () => 'Body type'

  render(t: OcBodyType): string {
    return t.description;
  }
}

class OcEthnicityRenderer extends TraitRenderer<OcEthnicity> {
  readonly typeLabel = () => 'Ethnicity'

  render(t: OcEthnicity): string {
    return t.description;
  }
}

class OcEyeColorRenderer extends TraitRenderer<OcEyeColor> {
  readonly typeLabel = () => 'Eye color'

  render(t: OcEyeColor): string {
    if (!!t.variant) return `${t.variant} (${this.titleCase(t.type)})`
    else return this.titleCase(t.type)
  }
}

class OcGenderRenderer extends TraitRenderer<OcGender> {
  readonly typeLabel = () => 'Gender'

  render(t: OcGender): string {
    return t.description;
  }
}

class OcHairStyleRenderer extends TraitRenderer<OcHairStyle> {
  readonly typeLabel = () => 'Hair style'

  render(t: OcHairStyle): string {
    if (t.dyed) {
      if (!!t.variant) return `${this.titleCase(t.length)} dyed ${t.dyeColor} (actually ${t.variant} ${this.titleCase(t.baseColor)})`
      else return `${this.titleCase(t.length)} dyed ${t.dyeColor} (actually ${this.titleCase(t.baseColor)})`
    } else {
      if (!!t.variant) return `${this.titleCase(t.length)} ${t.variant} (${this.titleCase(t.baseColor)})`
      else return `${this.titleCase(t.length)} ${this.titleCase(t.baseColor)}`
    }
  }
}

class OcCustomTraitRenderer extends TraitRenderer<OcCustomTrait> {
  typeLabel(t: OcCustomTrait) {
    return t.label
  }

  render(t: OcCustomTrait): string {
    return t.description;
  }
}

class OcSexualityRenderer extends TraitRenderer<OcSexuality> {
  readonly typeLabel = () => 'Sexuality'

  render(t: OcSexuality): string {
    return t.description;
  }
}

@Pipe({
  name: 'traitLabel'
})
export class TraitLabelPipe implements PipeTransform {

  private readonly titleCase = new TitleCasePipe()
  private readonly rendererMap: Record<string, TraitRenderer<OcCharacterTrait>> = {
    'OcBodyType': new OcBodyTypeRenderer(this.titleCase),
    'OcEthnicity': new OcEthnicityRenderer(this.titleCase),
    'OcEyeColor': new OcEyeColorRenderer(this.titleCase),
    'OcGender': new OcGenderRenderer(this.titleCase),
    'OcHairStyle': new OcHairStyleRenderer(this.titleCase),
    'OcCustomTrait': new OcCustomTraitRenderer(this.titleCase),
    'OcSexuality': new OcSexualityRenderer(this.titleCase),
  }

  transform(value: Nullable<OcCharacterTrait>, includeType = true): string {
    if (!value) return ''

    const renderer = this.rendererMap[value.traitType]
    if (!renderer) throw new Error(`Unsupported trait type: ${value.traitType}`)

    if (includeType) return `${renderer.typeLabel(value)}: ${renderer.render(value)}`
    else return renderer.render(value)
  }
}
