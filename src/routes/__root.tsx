import { Toaster } from '@/components/ui/toaster'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

function RootIndex(): JSX.Element {
  return (
    <main>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </main>
  )
}

export const Route = createRootRoute({
  component: RootIndex,
})