import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { getGlobalData } from '@/data/loaders'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  loader: async () => {
    try {
      const global = await getGlobalData()
      return { global: global.data }
    } catch {
      return { global: null }
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Code In Public' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const { global } = Route.useLoaderData()
  const siteTitle = global?.title ?? 'Code In Public'

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b-4 border-foreground bg-primary">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2 no-underline"
          >
            <span className="inline-block border-3 border-foreground bg-foreground px-2.5 py-0.5 text-xs font-black uppercase tracking-widest text-primary transition-all group-hover:bg-primary group-hover:text-foreground">
              &#x7B; &#x7D;
            </span>
            <span className="text-lg font-black uppercase tracking-tight text-foreground">
              {siteTitle}
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className="border-2 border-transparent px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-primary [&.active]:border-foreground [&.active]:bg-foreground [&.active]:text-primary"
            >
              Home
            </Link>
            <Link
              to="/blog"
              search={{ page: 1, query: '' }}
              className="border-2 border-transparent px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-primary [&.active]:border-foreground [&.active]:bg-foreground [&.active]:text-primary"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t-4 border-foreground bg-foreground py-12 text-primary">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-black uppercase tracking-tight">{siteTitle}</p>
              {global?.description && (
                <p className="mt-1 max-w-sm text-sm font-medium text-primary/70">
                  {global.description}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex gap-2">
                <Link
                  to="/"
                  search={{}}
                  className="border-2 border-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary transition-all hover:bg-primary hover:text-foreground"
                >
                  Home
                </Link>
                <Link
                  to="/blog"
                  search={{ page: 1, query: '' }}
                  className="border-2 border-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary transition-all hover:bg-primary hover:text-foreground"
                >
                  Blog
                </Link>
              </div>
              <p className="text-xs font-medium text-primary/50">
                &copy; {new Date().getFullYear()} {siteTitle}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
