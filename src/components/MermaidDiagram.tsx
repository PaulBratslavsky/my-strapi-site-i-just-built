import { useEffect, useRef, useState } from 'react'
import { labels } from '@/lib/labels'

interface Props {
  chart: string
}

let mermaidInitialized = false

export default function MermaidDiagram({ chart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
              primaryColor: '#FFE500',
              primaryTextColor: '#111',
              primaryBorderColor: '#111',
              lineColor: '#111',
              secondaryColor: '#fff',
              tertiaryColor: '#f5f5f5',
              background: '#ffffff',
              mainBkg: '#FFE500',
              nodeBorder: '#111111',
              clusterBkg: '#f9f9f9',
              titleColor: '#111',
              edgeLabelBackground: '#ffffff',
              fontFamily: 'Space Grotesk, ui-sans-serif, system-ui, sans-serif',
              fontSize: '14px',
            },
            securityLevel: 'loose',
          })
          mermaidInitialized = true
        }

        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg: rendered } = await mermaid.render(id, chart.trim())

        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to render diagram')
          setSvg(null)
        }
      }
    }

    render()
    return () => { cancelled = true }
  }, [chart])

  if (error) {
    return (
      <div className="my-6 border-4 border-destructive bg-destructive/10 p-4">
        <p className="text-sm font-black uppercase tracking-widest text-destructive">
          {labels.diagram.error}
        </p>
        <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">{chart}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-6 flex items-center justify-center border-4 border-foreground bg-primary/20 p-10">
        <span className="text-sm font-black uppercase tracking-widest text-foreground/60 animate-pulse">
          {labels.diagram.rendering}
        </span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-6 overflow-x-auto border-4 border-foreground bg-white p-6"
      style={{ boxShadow: '5px 5px 0 #111' }}
      // Safe — mermaid generates its own controlled SVG
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
