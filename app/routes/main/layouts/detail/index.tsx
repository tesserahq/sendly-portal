import { redirect } from 'react-router'

export async function loader({ params }: { params: { layoutID: string } }) {
  return redirect(`/layouts/${params.layoutID}/overview`)
}

export default function LayoutDetailIndex() {
  return null
}
