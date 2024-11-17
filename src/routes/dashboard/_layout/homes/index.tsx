import { createFileRoute } from '@tanstack/react-router'

function HomeManagementPage(): JSX.Element {
  return <div>Hello /dashboard/_layout/homes/!</div>
}

export const Route = createFileRoute('/dashboard/_layout/homes/')({
  component: HomeManagementPage,
})
