import { Button } from '@/components/ui/button'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

function AuthPagesLayout(): JSX.Element {
  return (
    <div className="w-screen min-h-screen min-w-fit h-fit py-16 flex items-center justify-center bg-main-palette-1">
      <div className="flex flex-col gap-2 w-[30rem] p-10 bg-main-palette-0 rounded-lg">
        <Link to="..">
          <Button className="flex flex-row items-center content-center gap-2 px-0 w-fit" variant="link">
            <ChevronLeft size={18} />
            <p className="">Quay lại trang chính</p>
          </Button>
        </Link>

        <div className="flex flex-col gap-2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/(auth)/_layout')({
  component: AuthPagesLayout,
})
