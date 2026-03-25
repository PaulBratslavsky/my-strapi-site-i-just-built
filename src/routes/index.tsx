import { createFileRoute, Link } from '@tanstack/react-router'
import { getLandingPage, getArticles } from '@/data/loaders'
import { getStrapiMedia } from '@/lib/strapi'
import { contentConfig } from '@/lib/content-config'

export const Route = createFileRoute('/')( {
  loader: async () => {
    const [landingPage, latestArticles] = await Promise.all([
      getLandingPage(),
      getArticles({ data: { page: 1, query: '' } }),
    ])
    return { landingPage: landingPage.data, articles: latestArticles.data ?? [] }
  },
  component: HomePage,
})

function HomePage() {
  const { landingPage, articles } = Route.useLoaderData()

  const heroBlock = landingPage?.blocks?.find(
    (b: any) => b.__component === 'blocks.hero',
  )

  const heading = heroBlock?.heading ?? landingPage?.title ?? 'Welcome'
  const subtext = heroBlock?.text ?? landingPage?.description ?? null

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="border-b-4 border-foreground bg-primary">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              {/* eyebrow */}
              <div className="mb-5 inline-flex items-center border-2 border-foreground bg-foreground px-3 py-1">
                <span className="text-xs font-black uppercase tracking-widest text-primary">
                  {contentConfig.home.eyebrowLabel}
                </span>
              </div>

              <h1 className="text-5xl font-black uppercase leading-[1.0] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                {heading}
              </h1>

              {subtext && (
                <p className="mt-6 max-w-xl border-l-4 border-foreground pl-4 text-lg font-medium leading-relaxed text-foreground/80">
                  {subtext}
                </p>
              )}

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/blog"
                  search={{ page: 1, query: '' }}
                  className="brutal-shadow border-3 border-foreground bg-foreground px-7 py-3 text-sm font-black uppercase tracking-widest text-primary transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[7px_7px_0_oklch(0.08_0.01_260)]"
                >
                  Read the Blog →
                </Link>
              </div>
            </div>

            {/* decorative counter */}
            <div className="hidden border-4 border-foreground bg-background p-6 lg:block">
              <p className="text-6xl font-black leading-none text-foreground">
                {articles.length}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {contentConfig.home.articlesCountLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER / marquee strip ────────────────────────────── */}
      <div className="overflow-hidden border-b-4 border-foreground bg-secondary py-3">
        <div className="flex animate-[marquee_18s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8 text-xs font-black uppercase tracking-widest text-secondary-foreground">
              Code In Public &nbsp;&bull;&nbsp; Self Taught &nbsp;&bull;&nbsp; Build In Public &nbsp;&bull;&nbsp; Learn &nbsp;&bull;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── LATEST ARTICLES ────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            {/* section header */}
            <div className="mb-12 flex items-end justify-between border-b-4 border-foreground pb-4">
              <div>
                <span className="block text-xs font-black uppercase tracking-widest text-secondary">
                  {contentConfig.home.latestArticlesLabel}
                </span>
                <h2 className="mt-1 text-4xl font-black uppercase tracking-tight">
                  {contentConfig.home.recentPostsHeading}
                </h2>
              </div>
              <Link
                to="/blog"
                search={{ page: 1, query: '' }}
                className="border-2 border-foreground px-4 py-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-foreground hover:text-primary"
              >
                {contentConfig.home.viewAllLink}
              </Link>
            </div>

            {/* article grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 6).map((article: any, idx: number) => (
                <ArticleCard key={article.documentId} article={article} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/* Accent colours cycling for card tops */
const ACCENT_CLASSES = [
  'bg-primary',
  'bg-secondary',
  'bg-accent',
  'bg-primary',
  'bg-accent',
  'bg-secondary',
]

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
      {/* coloured top bar */}
      <div className={`h-2 w-full ${accentClass} border-b-3 border-foreground`} />

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
                className="border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-foreground"
              >
                {tag.title}
              </span>
            ))}
          </div>
        )}

        {/* title */}
        <h3 className="line-clamp-2 text-base font-black uppercase leading-tight tracking-tight text-foreground">
          {article.title}
        </h3>

        {/* description */}
        {article.description && (
          <p className="line-clamp-2 text-sm font-medium text-muted-foreground">
            {article.description}
          </p>
        )}

        {/* date */}
        {article.publishedAt && (
          <time className="mt-auto border-t-2 border-foreground/20 pt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
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