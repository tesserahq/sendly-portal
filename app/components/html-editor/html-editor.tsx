import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { TabButton } from '@/components/email-activity/detail/email-viewer/tab-button'
import { useHtmlValidation } from './use-html-validation'

type Tab = 'html' | 'preview'

interface HtmlEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
}

export function HtmlEditor({ value, onChange, height = '500px' }: HtmlEditorProps) {
  const [tab, setTab] = useState<Tab>('html')
  const { handleMount } = useHtmlValidation(value)

  const handleChange = (val: string | undefined) => {
    onChange(val ?? '')
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b">
        <TabButton active={tab === 'html'} onClick={() => setTab('html')}>
          HTML
        </TabButton>
        <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
          Preview
        </TabButton>
      </div>

      <div className="border border-t-0 rounded-b overflow-hidden">
        {tab === 'html' && (
          <Editor
            height={height}
            language="html"
            value={value}
            onChange={handleChange}
            onMount={handleMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 3,
              lineHeight: 24,
              automaticLayout: true,
            }}
          />
        )}

        {tab === 'preview' && (
          <iframe
            srcDoc={
              value ||
              '<p style="padding:16px;font-size:14px;color:#9ca3af">Nothing to preview yet.</p>'
            }
            style={{ height }}
            className="w-full border-0"
            sandbox=""
            title="HTML Preview"
          />
        )}
      </div>
    </div>
  )
}
