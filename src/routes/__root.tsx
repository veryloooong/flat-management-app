import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

function RootIndex(): JSX.Element {
  return (
    <main>
      <Outlet />
      <TanStackRouterDevtools />
    </main>
  )
}

export const Route = createRootRoute({
  component: RootIndex,
})