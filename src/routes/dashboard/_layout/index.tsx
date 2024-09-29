import { createFileRoute } from '@tanstack/react-router'

function DashboardPage(): JSX.Element {
  return <div>Hello /dashboard/!</div>
}

export const Route = createFileRoute('/dashboard/_layout/')({
  component: DashboardPage,
})
