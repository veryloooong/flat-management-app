import { createFileRoute, Outlet } from '@tanstack/react-router'

function DashboardLayoutPage(): JSX.Element {
  return (
    <div>
      <div className="w-full h-16 bg-main-palette-5"></div>
      <h1>Dashboard Layout</h1>
      <p>This is the dashboard layout.</p>
      <Outlet />
      <header>
        <h1>ĐẠI HỌC BÁCH KHOA HÀ NỘI</h1>
        <p>Hanoi University of Science and Technology</p>
      </header>
    </div>
    
  )
}

export const Route = createFileRoute('/dashboard/_layout')({
  component: DashboardLayoutPage,
})
