import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/modules/shadcn/ui/Combobox'
import { Button } from '@shadcn/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shadcn/ui/dialog'
import { Label } from '@shadcn/ui/label'
import { forwardRef, useImperativeHandle, useState } from 'react'

export interface FilterDialogConfig {
  title?: string
  label: string
  value: string[]
  placeholder?: string
  onApply: (values: string[]) => void
  onClear?: () => void
}

export interface FilterDialogHandle {
  open: (config: FilterDialogConfig) => void
  close: () => void
  updateConfig: (updates: Partial<FilterDialogConfig>) => void
}

interface FilterDialogProps {
  items?: string[]
}

export const FilterDialog = forwardRef<FilterDialogHandle, FilterDialogProps>(({ items }, ref) => {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<FilterDialogConfig>({
    label: '',
    value: [],
    onApply: () => {},
  })
  const [draftValue, setDraftValue] = useState<string[]>([])
  const anchor = useComboboxAnchor()

  useImperativeHandle(ref, () => ({
    open: (newConfig: FilterDialogConfig) => {
      setConfig(newConfig)
      setDraftValue(newConfig.value)
      setOpen(true)
    },
    close: () => setOpen(false),
    updateConfig: (updates: Partial<FilterDialogConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }))
    },
  }))

  const { title = 'Filter', label, placeholder = 'Select…', onApply, onClear } = config

  const handleApply = () => {
    onApply(draftValue)
    setOpen(false)
  }

  const handleClear = () => {
    setDraftValue([])
    onClear?.()
    setOpen(false)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 animate-in fade-in-0"
          onClick={() => setOpen(false)}
        />
      )}
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="flex items-start justify-between mb-1">
              <Label htmlFor="filter-dialog-combobox">{label}</Label>
              {onClear && draftValue.length > 0 && (
                <Button variant="link" size="xs" className="h-auto p-0" onClick={handleClear}>
                  Clear all
                </Button>
              )}
            </div>
            <Combobox
              multiple
              autoHighlight
              defaultOpen
              items={items}
              value={draftValue}
              onValueChange={setDraftValue}>
              <ComboboxChips ref={anchor} id="filter-dialog-combobox" className="w-full">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((v: string) => (
                        <ComboboxChip key={v}>{v}</ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        className="rounded-md"
                        placeholder={draftValue.length === 0 ? placeholder : undefined}
                      />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item} className="py-2 hover:cursor-pointer">
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleApply}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
})

FilterDialog.displayName = 'FilterDialog'
