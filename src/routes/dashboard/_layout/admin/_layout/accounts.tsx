import { createFileRoute } from '@tanstack/react-router'

function AdminAccountsPage(): JSX.Element {
  return (
    <div>
      <h1>Admin Accounts</h1>
      <p>Admin accounts page</p>
    </div>
  )
}

export const Route = createFileRoute(
  '/dashboard/_layout/admin/_layout/accounts',
)({
  component: AdminAccountsPage,
  loader: async ({ context }) => {
  },
})
