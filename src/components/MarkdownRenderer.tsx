import ReactMarkdown from 'react-markdown'
import { lazy, Suspense } from 'react'
import type { Components } from 'react-markdown'
import { labels } from '@/lib/labels'

const MermaidDiagram = lazy(() => import('@/components/MermaidDiagram'))

const components: Components = {
  code({ className, children, ...props }) {
    const language = (className ?? '').replace('language-', '')
    const code = String(children).replace(/\n$/, '')

    if (language === 'mermaid') {
      return (
        <Suspense
          fallback={
            <div className="my-6 flex items-center justify-center border-4 border-foreground bg-primary/20 p-10">
              <span className="text-sm font-black uppercase tracking-widest text-foreground/60 animate-pulse">
                {labels.diagram.loading}
              </span>
            </div>
          }
        >
          <MermaidDiagram chart={code} />
        </Suspense>
      )
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },

  pre({ children, ...props }) {
    return (
      <pre
        className="overflow-x-auto border-4 border-foreground bg-neutral-900 p-5 text-sm text-neutral-100"
        style={{ boxShadow: '4px 4px 0 #111' }}
        {...props}
      >
        {children}
      </pre>
    )
  },
}

interface Props {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className }: Props) {
  return (
    <div className={`prose prose-neutral max-w-none ${className ?? ''}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
}
