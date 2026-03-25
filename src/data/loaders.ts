import { createServerFn } from '@tanstack/react-start'
import { fetchStrapi } from '@/lib/strapi'

// ── Landing Page ────────────────────────────────────────────────
export const getLandingPage = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchStrapi<any>('/api/landing-page?populate[blocks][populate]=*&status=published')
})

// ── Global (header / footer) ────────────────────────────────────
export const getGlobalData = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchStrapi<any>(
    '/api/global?populate[header][populate][logo]=*&populate[header][populate][navItems][populate]=*&populate[header][populate][cta]=*&populate[footer][populate]=*&status=published',
  )
})

// ── Articles list with optional search + pagination ─────────────
export const getArticles = createServerFn({ method: 'GET' })
  .inputValidator((input?: { page?: number; query?: string }) => input)
  .handler(async ({ data }) => {
    const page = data?.page ?? 1
    const query = data?.query ?? ''
    let path = `/api/articles?populate=*&status=published&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=6`
    if (query) {
      path += `&filters[title][$containsi]=${encodeURIComponent(query)}`
    }
    return fetchStrapi<any>(path)
  })

// ── Single article by slug ───────────────────────────────────────
export const getArticleBySlug = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return fetchStrapi<any>(
      `/api/articles?filters[slug][$eq]=${slug}&populate=*&status=published`,
    )
  })
