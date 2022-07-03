export type OcCharacterRelationshipType = 'FAMILY' | 'ROMANTIC' | 'FRIENDSHIP'

export interface OcCharacter {
  id: string
  name: string
  nickname: string
  dateOfBirth: number,
  notes: string
}

export interface OcCharacterRelationship {
  id: string
  type: OcCharacterRelationshipType
  description: string
  sourceCharacterId: string
  targetCharacterId: string
}
