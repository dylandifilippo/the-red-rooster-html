export type ProgramId = 'bjj-adults' | 'bjj-kids' | 'grappling' | 'lutte'
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'friday'

export interface Program {
  id: ProgramId
  image: string
}

export interface Instructor {
  id: 'pierre' | 'sebastien' | 'mike'
  image: string
}

export interface ClassSlot {
  programId: ProgramId
  start: string
  end: string
}

export interface DaySchedule {
  day: Weekday
  slots: ClassSlot[]
}

export interface PriceCard {
  id: string
  price: number
}

export interface PricingGroup {
  id: 'adults' | 'kids'
  cards: PriceCard[]
}
