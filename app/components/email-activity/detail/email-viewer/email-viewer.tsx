import { useState } from 'react'
import { TabButton } from './tab-button'
import { Button } from '@/modules/shadcn/ui/button'
import { downloadFile } from '@/utils/helpers/email.downloader'

type Tab = 'html' | 'raw'

export function EmailViewer({
  html,
  raw,
  className,
}: {
  html: string
  raw: string
  className?: string
}) {
  const [tab, setTab] = useState<Tab>('html')

  return (
    <div className={className}>
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TabButton active={tab === 'html'} onClick={() => setTab('html')}>
            HTML
          </TabButton>
          <TabButton active={tab === 'raw'} onClick={() => setTab('raw')}>
            Source
          </TabButton>
        </div>
        <Button
          variant="link"
          size="xs"
          className="w-fit h-6"
          onClick={() => downloadFile(html, 'email.html', 'text/html;charset=utf-8')}>
          <span className="text-xs capitalize">Download</span>
        </Button>
      </div>

      {/* Content */}
      <div className="border rounded-b overflow-hidden">
        {tab === 'html' && (
          <iframe
            srcDoc={html}
            className="w-full h-[600px] border-0"
            sandbox=""
            title="Email Content"
          />
        )}

        {tab === 'raw' && <pre className="p-4 h-[600px] overflow-auto text-xs">{raw}</pre>}
      </div>
    </div>
  )
}
