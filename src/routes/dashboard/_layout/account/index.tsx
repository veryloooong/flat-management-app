import { createFileRoute } from '@tanstack/react-router'

function AccountPage(): JSX.Element {
  return (
    <div>
      <h1>Hello /dashboard/account!</h1>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/account/')({
  component: AccountPage,
})
