import { redirect } from 'react-router'

export async function loader({ params }: { params: { batchID: string } }) {
  return redirect(`/broadcasts/${params.batchID}/overview`)
}

export default function BroadcastDetailIndex() {
  return null
}
