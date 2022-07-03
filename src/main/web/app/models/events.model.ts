export interface OcEvent {
  id: string
  date: number
  description: string
}

export interface OcEventSettings {
  readonly id: string
  useFixedDate: boolean
  eventReferenceDate: number
}
