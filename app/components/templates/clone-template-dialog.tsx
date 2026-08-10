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
import { CopyCheck, Loader2 } from 'lucide-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

export interface CloneConfirmationConfig {
  title: string
  description: string
  onClone: () => void | Promise<void>
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
    onClone: () => {},
  })

  useImperativeHandle(ref, () => ({
    open: (newConfig: CloneConfirmationConfig) => {
      setConfig(newConfig)
      setOpen(true)
    },
    close: () => setOpen(false),
    updateConfig: (updates: Partial<CloneConfirmationConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }))
    },
  }))

  const handleClone = async () => {
    await config.onClone()
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

        <DialogFooter className="mt-3">
          <div className="flex w-full justify-center gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-1/2" disabled={config.isLoading}>
                Cancel
              </Button>
            </DialogClose>

            <Button className="w-1/2" onClick={handleClone} disabled={config.isLoading}>
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
