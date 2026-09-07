import { Button } from '@shadcn/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shadcn/ui/dialog'
import { Input } from '@shadcn/ui/input'
import { Label } from '@shadcn/ui/label'
import { CopyCheck, Loader2 } from 'lucide-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')

export interface CloneConfirmationConfig {
  title: string
  description: string
  initialName: string
  initialAlias: string
  onClone: (values: { name: string; alias: string }) => void | Promise<void>
  isLoading?: boolean
}

export interface CloneTemplateDialogHandle {
  open: (config: CloneConfirmationConfig) => void
  close: () => void
  updateConfig: (updates: Partial<CloneConfirmationConfig>) => void
}

export const CloneTemplateDialog = forwardRef<CloneTemplateDialogHandle, object>((_props, ref) => {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<CloneConfirmationConfig>({
    title: '',
    description: '',
    initialName: '',
    initialAlias: '',
    onClone: () => {},
  })
  const [name, setName] = useState('')
  const [alias, setAlias] = useState('')

  useImperativeHandle(ref, () => ({
    open: (newConfig: CloneConfirmationConfig) => {
      setConfig(newConfig)
      setName(newConfig.initialName)
      setAlias(newConfig.initialAlias)
      setOpen(true)
    },
    close: () => setOpen(false),
    updateConfig: (updates: Partial<CloneConfirmationConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }))
    },
  }))

  const canClone = name.trim() !== '' && alias.trim() !== ''

  const handleClone = async () => {
    if (!canClone) return
    await config.onClone({ name, alias })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-t-primary max-w-md border-t-4">
        <DialogHeader className="flex flex-col items-center">
          <div
            className="bg-primary -mt-16 flex h-16 w-16 items-center justify-center rounded-full
              p-3">
            <CopyCheck size={100} className="text-white" />
          </div>
          <DialogTitle className="hidden"></DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-3" asChild>
          <div className="flex flex-col items-center max-w-md wrap-break-word">
            <h1
              className="dark:text-secondary-foreground text-center text-3xl font-semibold
                text-black">
              {config.title}
            </h1>
            <p
              className="dark:text-secondary-foreground mt-3 text-center text-base text-black
                max-w-sm wrap-break-word overflow-hidden text-ellipsis">
              {config.description}
            </p>
          </div>
        </DialogDescription>

        <div className="flex flex-col gap-3 px-3">
          <div className="flex flex-col">
            <Label htmlFor="clone-name">Name</Label>
            <Input
              id="clone-name"
              value={name}
              autoFocus
              onChange={(e) => {
                setName(e.target.value)
                setAlias(slugify(e.target.value))
              }}
              disabled={config.isLoading}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="clone-alias">Alias</Label>
            <Input
              id="clone-alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
              disabled={config.isLoading}
            />
          </div>
        </div>

        <DialogFooter className="mt-3">
          <div className="flex w-full justify-center gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-1/2" disabled={config.isLoading}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="w-1/2"
              onClick={handleClone}
              disabled={config.isLoading || !canClone}>
              {config.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cloning...
                </>
              ) : (
                <>Confirm</>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

CloneTemplateDialog.displayName = 'CloneTemplateDialog'
