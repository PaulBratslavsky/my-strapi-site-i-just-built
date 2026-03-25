import { Link } from '@tanstack/react-router'
import { getStrapiMedia } from '@/lib/strapi'

interface Article {
  documentId: string
  title: string
  description?: string
  slug: string
  publishedAt?: string
  featuredImage?: { url?: string; formats?: { medium?: { url: string } } } | null
  contentTags?: { id: number; title: string }[]
}

const ACCENT_CLASSES = [
  'bg-primary',
  'bg-secondary',
  'bg-accent',
  'bg-primary',
  'bg-accent',
  'bg-secondary',
]

export default function ArticleCard({
  article,
  index = 0,
}: {
  article: Article
  index?: number
}) {
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
        {article.contentTags && article.contentTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.contentTags.slice(0, 2).map((tag) => (
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
