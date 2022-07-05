export type OcEyeColorType = 'BLUE' | 'BROWN' | 'GREEN' | 'VIOLET' | 'EXOTIC'
export type OcHairStyleLength = 'SHAVED' | 'SHORT' | 'MEDIUM' | 'LONG'
export type OcHairStyleColor = 'BLONDE' | 'BRUNETTE' | 'RED' | 'BLACK' | 'WHITE' | 'GRAY' | 'EXOTIC'
export type OcCharacterTraitType =
  OcBodyType['traitType']
  | OcEthnicity['traitType']
  | OcEyeColor['traitType']
  | OcGender['traitType']
  | OcHairStyle['traitType']
  | OcCustomTrait['traitType']
  | OcSexuality['traitType']

export const TRAIT_TYPES: OcCharacterTraitType[] = [
  'OcBodyType', 'OcEthnicity', 'OcEyeColor', 'OcGender',
  'OcHairStyle', 'OcCustomTrait', 'OcSexuality',
]

export const EYE_COLOR_TYPES: OcEyeColorType[] = [
  'BLUE', 'BROWN', 'GREEN', 'VIOLET', 'EXOTIC'
]

export const HAIR_STYLE_LENGTHS: OcHairStyleLength[] = [
  'SHAVED', 'SHORT', 'MEDIUM', 'LONG'
]

export const OC_HAIR_STYLE_COLORS: OcHairStyleColor[] = [
  'BLONDE', 'BRUNETTE', 'RED', 'BLACK', 'WHITE', 'GRAY', 'EXOTIC'
]

export interface OcCharacterTrait {
  readonly id: string
  readonly traitType: OcCharacterTraitType
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

export interface OcGender extends OcCharacterTrait {
  readonly traitType: 'OcGender'
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

export interface OcSexuality extends OcCharacterTrait {
  readonly traitType: 'OcSexuality'
  description: string
}
