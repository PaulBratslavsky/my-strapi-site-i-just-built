import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { getArticles } from '@/data/loaders'
import { getStrapiMedia } from '@/lib/strapi'
import { contentConfig } from '@/lib/content-config'
import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

export const Route = createFileRoute('/blog/')({ 
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 1),
    query: String(search.query ?? ''),
  }),
  loaderDeps: ({ search }) => ({ page: search.page, query: search.query }),
  loader: async ({ deps }) => {
    const page = deps.page ?? 1
    const query = deps.query ?? ''
    const result = await getArticles({ data: { page, query } })
    return { articles: result.data ?? [], meta: result.meta, page, query }
  },
  component: BlogListPage,
})

const ACCENT_CLASSES = [
  'bg-primary',
  'bg-secondary',
  'bg-accent',
  'bg-primary',
  'bg-accent',
  'bg-secondary',
]

function BlogListPage() {
  const { articles, meta, page, query } = Route.useLoaderData()
  const navigate = useNavigate({ from: '/blog/' })
  const [searchInput, setSearchInput] = useState(query)

  const totalPages = meta?.pagination?.pageCount ?? 1
  const totalArticles = meta?.pagination?.total ?? articles.length

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate({ search: { page: 1, query: searchInput } })
  }

  function goToPage(p: number) {
    navigate({ search: { page: p, query } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <section className="border-b-4 border-foreground bg-accent">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="block text-xs font-black uppercase tracking-widest text-foreground/60">
            {contentConfig.blog.pageHeading}
          </span>
          <h1 className="mt-2 text-5xl font-black uppercase tracking-tight text-foreground sm:text-6xl">
            {contentConfig.blog.pageHeading}
          </h1>
          <p className="mt-3 max-w-lg border-l-4 border-foreground pl-4 text-base font-medium text-foreground/70">
            {contentConfig.blog.pageDescription}
          </p>

          {/* ── SEARCH ── */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-xl gap-0">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={contentConfig.blog.searchPlaceholder}
                className="w-full border-3 border-r-0 border-foreground bg-card py-3 pl-11 pr-4 text-sm font-medium outline-none placeholder:text-muted-foreground focus:bg-primary/20"
              />
            </div>
            <button
              type="submit"
              className="brutal-shadow border-3 border-foreground bg-foreground px-6 py-3 text-sm font-black uppercase tracking-widest text-primary transition-all hover:bg-secondary hover:text-secondary-foreground"
            >
              {contentConfig.blog.searchButtonLabel}
            </button>
            {query && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  navigate({ search: { page: 1, query: '' } })
                }}
                className="border-3 border-l-0 border-foreground bg-muted px-4 py-3 transition-colors hover:bg-destructive hover:text-destructive-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </section>

      {/* ── RESULTS INFO ── */}
      <div className="border-b-2 border-foreground/20 bg-muted px-6 py-3">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {query
              ? `${totalArticles} result${totalArticles !== 1 ? 's' : ''} for "${query}"`
              : `${totalArticles} article${totalArticles !== 1 ? 's' : ''} total`}
          </p>
        </div>
      </div>

      {/* ── ARTICLE GRID ── */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any, idx: number) => (
              <ArticleCard key={article.documentId} article={article} index={idx} />
            ))}
          </div>
        ) : (
          <div className="border-4 border-foreground bg-muted p-16 text-center">
            <p className="text-2xl font-black uppercase">
              {contentConfig.blog.noResultsMessage}
            </p>
            {query && (
              <button
                onClick={() => {
                  setSearchInput('')
                  navigate({ search: { page: 1, query: '' } })
                }}
                className="mt-6 border-3 border-foreground bg-primary px-6 py-2 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-foreground hover:text-primary"
              >
                {contentConfig.blog.clearSearchLabel}
              </button>
            )}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="mt-16">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="brutal-shadow flex h-10 w-10 items-center justify-center border-3 border-foreground bg-card transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isVisible =
                  p === 1 || p === totalPages || Math.abs(p - page) <= 1
                const showEllipsisBefore = p === page - 2 && page - 2 > 1
                const showEllipsisAfter = p === page + 2 && page + 2 < totalPages

                if (!isVisible && !showEllipsisBefore && !showEllipsisAfter) return null
                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span key={`e-${p}`} className="px-1 text-lg font-black text-muted-foreground">
                      …
                    </span>
                  )
                }

                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`h-10 w-10 border-3 text-sm font-black transition-all ${
                      p === page
                        ? 'brutal-shadow border-foreground bg-primary text-foreground'
                        : 'border-foreground bg-card hover:bg-primary'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="brutal-shadow flex h-10 w-10 items-center justify-center border-3 border-foreground bg-card transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Page {page} of {totalPages} &nbsp;&mdash;&nbsp; {totalArticles} articles
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ArticleCard({ article, index = 0 }: { article: any; index?: number }) {
  const imageUrl =
    article.featuredImage?.formats?.medium?.url ??
    article.featuredImage?.url ??
    null

  const accentClass = ACCENT_CLASSES[index % ACCENT_CLASSES.length]

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: article.slug }}
      className="brutal-shadow brutal-hover group flex flex-col border-3 border-foreground bg-card"
    >
      {/* colour accent top bar */}
      <div className={`h-2 w-full border-b-3 border-foreground ${accentClass}`} />

      {/* image */}
      <div className="overflow-hidden border-b-3 border-foreground">
        <img
          src={getStrapiMedia(imageUrl)}
          alt={article.title}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* tags */}
        {article.contentTags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.contentTags.slice(0, 2).map((tag: any) => (
              <span
                key={tag.id}
                className="border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest"
              >
                {tag.title}
              </span>
            ))}
          </div>
        )}

        <h3 className="line-clamp-2 text-base font-black uppercase leading-tight tracking-tight">
          {article.title}
        </h3>

        {article.description && (
          <p className="line-clamp-2 text-sm font-medium text-muted-foreground">
            {article.description}
          </p>
        )}

        {article.publishedAt && (
          <time className="mt-auto border-t-2 border-foreground/20 pt-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
    </Link>
  )
}
