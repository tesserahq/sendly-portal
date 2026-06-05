import { redirect } from 'react-router'

export async function loader({ params }: { params: { templateID: string } }) {
  return redirect(`/templates/${params.templateID}/overview`)
}

export default function TemplateDetailIndex() {
  return null
}
