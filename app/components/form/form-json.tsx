import { useFormContext } from './form-context'
import { JsonEditor, type JsonObject } from '@/components/json/editor'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/shadcn/ui/form'

interface FormJsonProps {
  field: string
  label?: string
  description?: string
  hideError?: boolean
  onValidityChange?: (isValid: boolean) => void
}

export const FormJson = ({
  field,
  label,
  description,
  hideError = false,
  onValidityChange,
}: FormJsonProps) => {
  const { form } = useFormContext()

  return (
    <FormField
      control={form.control}
      name={field}
      render={({ field: fieldProps }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <JsonEditor
              initialValue={fieldProps.value as JsonObject}
              onChange={fieldProps.onChange}
              onValidityChange={onValidityChange}
            />
          </FormControl>
          {!hideError && <FormMessage />}
        </FormItem>
      )}
    />
  )
}
