import { redirect } from 'react-router'

export async function loader({ params }: { params: { emailID: string } }) {
  return redirect(`/activity/${params.emailID}/overview`)
}

export default function EmailActivityDetailIndex() {
  return null
}
