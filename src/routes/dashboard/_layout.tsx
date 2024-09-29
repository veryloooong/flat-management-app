import { createFileRoute, Outlet } from '@tanstack/react-router'

function DashboardLayoutPage(): JSX.Element {
  return (
    <div>
      <h1>Dashboard Layout</h1>
      <p>This is the dashboard layout.</p>
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout')({
  component: DashboardLayoutPage,
})
