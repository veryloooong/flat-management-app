import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useAuth } from '@/lib/auth'

import { createFileRoute, Outlet, Link, redirect } from '@tanstack/react-router'
import { HomeIcon, BellIcon, UserIcon } from 'lucide-react'

function DashboardLayoutPage(): JSX.Element {
  const { logout } = useAuth();

  return (
    <div>
      <header className="w-full h-20 bg-main-palette-5 flex items-center justify-between">
        {/* Link với biểu tượng ngôi nhà bên trái */}
        <div className="flex items-center ml-7">
          <Link to="/dashboard" className="flex items-center">
            <HomeIcon className="w-10 h-10 text-white" />
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 mr-6 relative">
          {/* Icon Notification */}
          <div className="relative">
            <BellIcon
              className="w-6 h-6 text-white cursor-pointer"
            />
          </div>

          {/* Icon User */}
          <div className="relative">
            {/* Dropdown Menu */}
            <Popover>
              <PopoverTrigger>
                <UserIcon className="w-6 h-6 text-white cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="p-2 w-fit">
                <Link to="/dashboard/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Xem thông tin tài khoản
                </Link>
                <Link to="/dashboard/account/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Chỉnh sửa thông tin tài khoản
                </Link>
                <Link to='/login'>
                  <button
                    type="button"
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </Link>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout')({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated } = context.authentication;

    const userInfo = await isAuthenticated();

    if (!userInfo) {
      throw redirect({ to: '/login' });
    }

    return { userInfo };
  },
  component: DashboardLayoutPage,
})


