import { createFileRoute } from '@tanstack/react-router'

function AccountPage(): JSX.Element {
  return <div>Hello /dashboard/account/!</div>
}

export const Route = createFileRoute('/dashboard/_layout/account/')({
  component: AccountPage,
})
