export type ProgramId = 'bjj-adults' | 'bjj-kids' | 'grappling' | 'lutte'
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'friday' | 'sunday'

export interface Program {
  id: ProgramId
  image: string
}

export interface Instructor {
  id: 'pierre' | 'sebastien' | 'mike' | 'hugues'
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
  id: 'adults' | 'kids' | 'lutte'
  cards: PriceCard[]
}

/**
 * Column span for a gallery cell on the contact-sheet grid (2 cols on
 * mobile, 3 cols on lg+). `span` picks the Tailwind class the component
 * applies:
 *   - 1     -> no span class (single cell at both breakpoints)
 *   - 2     -> "col-span-2" (double-wide at BOTH breakpoints)
 *   - 'lg-2'-> "lg:col-span-2" (single-wide on mobile, double-wide on lg)
 * This third value exists because the same span pattern that tiles a
 * clean 2-col mobile grid does not also tile a clean 3-col desktop grid
 * (see Gallery.tsx grid-arithmetic comment for the row math).
 */
export interface GalleryPhoto {
  src: string
  span: 1 | 2 | 'lg-2'
  /**
   * Optional CSS `object-position` override (e.g. '50% 20%') for photos
   * whose subject is cropped out by the default center-crop under the
   * fixed 300px/44vw row heights. Applied via the Image `style` prop.
   */
  objectPosition?: string
}
