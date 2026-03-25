import { createFileRoute, Link } from '@tanstack/react-router'
import { getArticleBySlug } from '@/data/loaders'
import { getStrapiMedia } from '@/lib/strapi'
import { ArrowLeft, Tag, Calendar } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { contentConfig } from '@/lib/content-config'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const result = await getArticleBySlug({ data: params.slug })
    const article = result.data?.[0]
    if (!article) throw new Error('Article not found')
    return { article }
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { article } = Route.useLoaderData()

  const imageUrl =
    article.featuredImage?.formats?.large?.url ??
    article.featuredImage?.url ??
    null

  const markdownContent = buildContent(article)

  return (
    <div>
      {/* ── HERO BANNER ── */}
      <section className="border-b-4 border-foreground bg-primary">
        <div className="mx-auto max-w-4xl px-6 py-10">
          {/* back link */}
          <Link
            to="/blog"
            search={{ page: 1, query: '' }}
            className="mb-8 inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog
          </Link>

          {/* Tags */}
          {article.contentTags?.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-foreground/60" />
              {article.contentTags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="border-2 border-foreground bg-foreground px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary"
                >
                  {tag.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          {/* Date */}
          {article.publishedAt && (
            <div className="mt-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground/60" />
              <time className="text-sm font-bold uppercase tracking-widest text-foreground/70">
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED IMAGE ── */}
      {imageUrl && (
        <div className="border-b-4 border-foreground">
          <img
            src={getStrapiMedia(imageUrl)}
            alt={article.title}
            className="h-72 w-full object-cover sm:h-[420px]"
          />
        </div>
      )}

      {/* ── ARTICLE BODY ── */}
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_260px]">

          {/* Main content */}
          <article>
            {/* Description lede */}
            {article.description && (
              <div className="brutal-shadow-yellow mb-10 border-4 border-foreground bg-primary p-6">
                <p className="text-lg font-bold leading-relaxed text-foreground">
                  {article.description}
                </p>
              </div>
            )}

            {markdownContent ? (
              <MarkdownRenderer content={markdownContent} />
            ) : (
              <p className="text-muted-foreground">
                {contentConfig.article.noContentMessage}
              </p>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Article info card */}
              <div className="border-3 border-foreground bg-card brutal-shadow">
                <div className="border-b-3 border-foreground bg-foreground px-4 py-2">
                  <p className="text-xs font-black uppercase tracking-widest text-primary">
                    {contentConfig.article.articleInfoLabel}
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  {article.publishedAt && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {contentConfig.article.publishedLabel}
                      </p>
                      <p className="text-sm font-bold">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  {article.contentTags?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {article.contentTags.map((tag: any) => (
                          <span
                            key={tag.id}
                            className="border-2 border-foreground bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest"
                          >
                            {tag.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* back button */}
              <Link
                to="/blog"
                search={{ page: 1, query: '' }}
                className="flex w-full items-center justify-center gap-2 border-3 border-foreground bg-foreground px-4 py-3 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {contentConfig.article.backToAllPostsLabel}
              </Link>
            </div>
          </aside>
        </div>

        {/* ── RELATED ARTICLES ── */}
        {article.relatedArticles?.length > 0 && (
          <div className="mt-20 border-t-4 border-foreground pt-12">
            <div className="mb-8 flex items-end gap-4">
              <div className="h-8 w-1.5 bg-secondary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {contentConfig.article.relatedArticlesHeading}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {article.relatedArticles.map((related: any) => (
                <Link
                  key={related.documentId}
                  to="/blog/$slug"
                  params={{ slug: related.slug }}
                  className="brutal-shadow brutal-hover group border-3 border-foreground bg-card p-5"
                >
                  <div className="mb-2 h-1 w-8 bg-primary" />
                  <h3 className="font-black uppercase leading-snug tracking-tight group-hover:text-secondary">
                    {related.title}
                  </h3>
                  {related.description && (
                    <p className="mt-2 line-clamp-2 text-sm font-medium text-muted-foreground">
                      {related.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── BOTTOM BACK LINK (mobile) ── */}
        <div className="mt-14 border-t-4 border-foreground pt-8 lg:hidden">
          <Link
            to="/blog"
            search={{ page: 1, query: '' }}
            className="inline-flex items-center gap-2 border-3 border-foreground bg-primary px-5 py-2.5 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {contentConfig.article.backToAllPostsLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}

function buildContent(article: any): string | null {
  if (article.content && article.content.trim()) return article.content
  if (article.blocks?.length) {
    const parts: string[] = []
    for (const block of article.blocks) {
      if (block.__component === 'blocks.markdown' && block.content) {
        parts.push(block.content)
      } else if (block.__component === 'blocks.section-heading') {
        if (block.subHeading) parts.push(`_${block.subHeading}_`)
        if (block.heading) parts.push(`## ${block.heading}`)
      }
    }
    if (parts.length) return parts.join('\n\n')
  }
  return null
}
