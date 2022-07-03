export type OcEyeColorType = 'BLUE' | 'BROWN' | 'GREEN' | 'VIOLET' | 'EXOTIC'
export type OcHairStyleLength = 'SHAVED' | 'SHORT' | 'MEDIUM' | 'LONG'
export type OcHairStyleColor = 'BLONDE' | 'BRUNETTE' | 'RED' | 'BLACK' | 'WHITE' | 'GRAY'

export interface OcCharacterTrait {
  readonly id: string
  readonly traitType: string
}

export interface OcBodyType extends OcCharacterTrait {
  readonly traitType: 'OcBodyType'
  label: string
}

export interface OcEthnicity extends OcCharacterTrait {
  readonly traitType: 'OcEthnicity'
  label: string
}

export interface OcEyeColor extends OcCharacterTrait {
  readonly traitType: 'OcEyeColor'
  type: OcEyeColorType
  variant: string
}

export interface OcGenderPreference extends OcCharacterTrait {
  readonly traitType: 'OcGenderPreference'
  label: string
}

export interface OcHairStyle extends OcCharacterTrait {
  readonly traitType: 'OcHairStyle'
  length: OcHairStyleLength
  baseColor: OcHairStyleColor
  variant: string
  dyed: boolean
  dyeColor?: string
}
