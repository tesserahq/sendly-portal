import { Form } from '@/components/form'
import { IQueryConfig } from '@/resources/queries'
import {
  parseEmailList,
  SendEmailFormValue,
  sendEmailFormSchema,
  SendEmailPayload,
} from '@/resources/queries/email'
import { TemplateType } from '@/resources/queries/template'
import { useSendEmail } from '@/resources/hooks/email/use-email'
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
import { Loader2 } from 'lucide-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { toast } from 'tessera-ui'

export interface SendEmailDialogHandle {
  open: (template: TemplateType) => void
  close: () => void
}

interface SendEmailDialogProps {
  config: IQueryConfig
}

export const SendEmailDialog = forwardRef<SendEmailDialogHandle, SendEmailDialogProps>(
  ({ config }, ref) => {
    const [open, setOpen] = useState(false)
    const [resetKey, setResetKey] = useState(0)
    const [templateId, setTemplateId] = useState('')
    const [templateName, setTemplateName] = useState('')
    const [defaultValues, setDefaultValues] = useState<SendEmailFormValue>({
      from_email: '',
      reply_to: '',
      to: '',
      cc: '',
      bcc: '',
      template_variables: {},
    })
    const [isJsonValid, setIsJsonValid] = useState(true)
    const [jsonError, setJsonError] = useState<string | null>(null)

    const sendEmailMutation = useSendEmail(config, {
      onSuccess: () => {
        toast.success('Test email sent successfully')
        setOpen(false)
      },
      onError: (error) => {
        toast.error('Failed to send email', {
          description: error?.message || 'Please try again.',
        })
      },
    })

    useImperativeHandle(ref, () => ({
      open: (template: TemplateType) => {
        setTemplateId(template.id)
        setTemplateName(template.name || template.alias)
        setDefaultValues({
          from_email: template.from_email ?? '',
          reply_to: template.reply_to ?? '',
          to: '',
          cc: '',
          bcc: '',
          template_variables: {},
        })
        setIsJsonValid(true)
        setJsonError(null)
        setResetKey((key) => key + 1)
        setOpen(true)
      },
      close: () => setOpen(false),
    }))

    const handleSubmit = async (values: SendEmailFormValue) => {
      if (!isJsonValid) {
        setJsonError('Invalid JSON in template variables. Please fix the syntax before sending.')
        return
      }

      setJsonError(null)

      const payload: SendEmailPayload = {
        from_email: values.from_email?.trim() || undefined,
        reply_to: values.reply_to?.trim() || undefined,
        to: parseEmailList(values.to),
        cc: parseEmailList(values.cc),
        bcc: parseEmailList(values.bcc),
        template_id: templateId,
        template_variables: values.template_variables,
      }

      try {
        await sendEmailMutation.mutateAsync(payload)
      } catch {
        // toast handled in onError
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-full!">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              This send an email using the &ldquo;{templateName}&rdquo; template. Edit the fields
              below before sending.
            </DialogDescription>
          </DialogHeader>

          <Form
            key={resetKey}
            schema={sendEmailFormSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Form.Email field="from_email" label="From Email" placeholder="sender@example.com" />
              <Form.Email field="reply_to" label="Reply To" placeholder="reply@example.com" />
            </div>

            <Form.Input
              field="to"
              label="To"
              required
              placeholder="test@example.com, another@example.com"
            />

            <div className="grid grid-cols-2 gap-4">
              <Form.Input field="cc" label="Cc" placeholder="cc@example.com" />
              <Form.Input field="bcc" label="Bcc" placeholder="bcc@example.com" />
            </div>

            <Form.Json
              field="template_variables"
              label="Template Variables"
              onValidityChange={setIsJsonValid}
            />

            {jsonError && <p className="text-destructive text-sm">{jsonError}</p>}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={sendEmailMutation.isPending}>
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={sendEmailMutation.isPending || !isJsonValid}>
                {sendEmailMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send'
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }
)

SendEmailDialog.displayName = 'SendEmailDialog'
