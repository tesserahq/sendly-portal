import { Button } from '@/modules/shadcn/ui/button'

export function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={` px-4 py-2 text-sm rounded-none bg-transparent border-0 border-b-2
        transition-colors duration-500 ease-out ${
          active
            ? 'border-primary text-primary font-semibold'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        } `}>
      {children}
    </Button>
  )
}
