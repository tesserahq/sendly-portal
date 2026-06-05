import { useState } from 'react'
import { TabButton } from '@/components/email-activity/detail/email-viewer/tab-button'
import { Textarea } from '@shadcn/ui/textarea'

type Tab = 'source' | 'html'

interface HtmlEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  id?: string
}

export function HtmlEditor({ value, onChange, placeholder, required, id }: HtmlEditorProps) {
  const [tab, setTab] = useState<Tab>('source')

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b">
        <TabButton active={tab === 'source'} onClick={() => setTab('source')}>
          Source
        </TabButton>
        <TabButton active={tab === 'html'} onClick={() => setTab('html')}>
          HTML
        </TabButton>
      </div>

      <div className="border border-t-0 rounded-b overflow-hidden">
        {tab === 'source' && (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="font-mono text-sm min-h-[400px] resize-y rounded-none border-0
              focus-visible:ring-0 focus-visible:ring-offset-0"
            required={required}
          />
        )}

        {tab === 'html' && (
          <iframe
            srcDoc={value || '<p class="p-4 text-sm text-gray-400">Nothing to preview yet.</p>'}
            className="w-full h-[400px] border-0"
            sandbox=""
            title="HTML Preview"
          />
        )}
      </div>
    </div>
  )
}
