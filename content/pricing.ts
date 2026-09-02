import type { PricingGroup } from './types'

export const pricing: PricingGroup[] = [
  {
    id: 'adults',
    cards: [
      { id: 'single', price: 7 },
      { id: 'card10', price: 60 },
      { id: 'monthly', price: 80 },
    ],
  },
  {
    id: 'lutte',
    cards: [{ id: 'single', price: 7 }],
  },
  {
    id: 'kids',
    cards: [
      { id: 'single', price: 6 },
      { id: 'card10', price: 50 },
    ],
  },
]
