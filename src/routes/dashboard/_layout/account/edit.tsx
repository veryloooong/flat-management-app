import { createFileRoute } from '@tanstack/react-router'

function EditAccountPage(): JSX.Element {
  return <div>Hello /dashboard/account/edit!</div>
}

export const Route = createFileRoute('/dashboard/_layout/account/edit')({
  component: EditAccountPage,
})
