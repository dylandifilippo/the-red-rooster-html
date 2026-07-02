import { Archivo, Playfair_Display } from 'next/font/google'

export const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
})
