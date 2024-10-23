import { createFileRoute } from '@tanstack/react-router'

function DashboardPage(): JSX.Element {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome</p>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/')({
  component: DashboardPage,
})
