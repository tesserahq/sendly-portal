import { HtmlEditor } from '@/components/html-editor/html-editor'
import { Input } from '@shadcn/ui/input'
import { Label } from '@shadcn/ui/label'
import { AlertTriangle } from 'lucide-react'

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')

interface LayoutFormFieldsProps {
  name: string
  onNameChange: (v: string) => void
  alias: string
  onAliasChange: (v: string) => void
  html: string
  onHtmlChange: (v: string) => void
  htmlHeight?: string
}

export function LayoutFormFields({
  name,
  onNameChange,
  alias,
  onAliasChange,
  html,
  onHtmlChange,
  htmlHeight = '600px',
}: LayoutFormFieldsProps) {
  const isMissingContentPlaceholder = html.length > 0 && !html.includes('${content}')

  return (
    <>
      <div className="flex justify-between items-center w-full gap-5">
        <div className="flex flex-col w-full">
          <Label htmlFor="lf-name">Name</Label>
          <Input
            id="lf-name"
            value={name}
            onChange={(e) => {
              onNameChange(e.target.value)
              onAliasChange(slugify(e.target.value))
            }}
            placeholder="e.g. Transactional Base Layout"
          />
        </div>
        <div className="flex flex-col w-full">
          <Label htmlFor="lf-alias">Alias</Label>
          <Input
            id="lf-alias"
            value={alias}
            onChange={(e) => onAliasChange(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
            placeholder="e.g. transactional-base"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lf-html" className="mb-0">
          HTML Body
        </Label>
        {isMissingContentPlaceholder && (
          <div
            className="flex items-center gap-2 rounded border border-yellow-400 bg-yellow-50 px-3
              py-2 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            <AlertTriangle size={14} className="shrink-0" />
            <span>
              Layout HTML must contain <code className="font-mono">${'{content}'}</code> — this is
              where template content will be injected.
            </span>
          </div>
        )}
        <HtmlEditor value={html} onChange={onHtmlChange} height={htmlHeight} />
      </div>
    </>
  )
}
