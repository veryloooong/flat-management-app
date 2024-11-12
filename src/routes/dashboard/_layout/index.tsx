import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

function DashboardPage(): JSX.Element {
  return (
    <div className="w-screen">
      <h1>Dashboard</h1>
      <p>Welcome</p>
      <div>
        <Link to="/dashboard/admin/accounts">
          <Button>Quản lý các tài khoản</Button>
        </Link>
        <Link to="/dashboard/fees">
          <Button>Quản lý các khoản thu</Button>
        </Link>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/')({
  component: DashboardPage,
})
