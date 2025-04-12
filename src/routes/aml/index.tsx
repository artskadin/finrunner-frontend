import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/aml/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/aml/"!</div>
}
