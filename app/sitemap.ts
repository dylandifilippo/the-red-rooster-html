import type { MetadataRoute } from 'next'

const BASE = 'https://theredroosteracademy.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { fr: `${BASE}/`, nl: `${BASE}/nl`, en: `${BASE}/en` }
  return [
    { url: `${BASE}/`, alternates: { languages } },
    { url: `${BASE}/nl`, alternates: { languages } },
    { url: `${BASE}/en`, alternates: { languages } },
  ]
}
