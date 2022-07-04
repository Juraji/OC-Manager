export type OcEyeColorType = 'BLUE' | 'BROWN' | 'GREEN' | 'VIOLET' | 'EXOTIC'
export type OcHairStyleLength = 'SHAVED' | 'SHORT' | 'MEDIUM' | 'LONG'
export type OcHairStyleColor = 'BLONDE' | 'BRUNETTE' | 'RED' | 'BLACK' | 'WHITE' | 'GRAY' | 'EXOTIC'

export interface OcCharacterTrait {
  readonly id: string
  readonly traitType: string
}

export interface OcBodyType extends OcCharacterTrait {
  readonly traitType: 'OcBodyType'
  description: string
}

export interface OcEthnicity extends OcCharacterTrait {
  readonly traitType: 'OcEthnicity'
  description: string
}

export interface OcEyeColor extends OcCharacterTrait {
  readonly traitType: 'OcEyeColor'
  type: OcEyeColorType
  variant: string
}

export interface OcGenderPreference extends OcCharacterTrait {
  readonly traitType: 'OcGenderPreference'
  description: string
}

export interface OcHairStyle extends OcCharacterTrait {
  readonly traitType: 'OcHairStyle'
  length: OcHairStyleLength
  baseColor: OcHairStyleColor
  variant: string
  dyed: boolean
  dyeColor?: string
}

export interface OcCustomTrait extends OcCharacterTrait {
  readonly traitType: 'OcCustomTrait'
  label: string
  description: string
}
