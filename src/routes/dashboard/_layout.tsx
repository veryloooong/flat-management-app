import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { ScanSearchIcon, SearchIcon, HomeIcon, BellIcon, UserIcon } from 'lucide-react'

function DashboardLayoutPage(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái của menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle trạng thái menu
  };

  return (
    <div>
      
      <div className="w-full h-20 bg-main-palette-5 flex items-center justify-between">
        {/* Link với biểu tượng ngôi nhà bên trái */}
        <div className="flex items-center ml-6" style={{ marginLeft: "30px" }}>
          <Link to="/dashboard" className="flex items-center">
            <HomeIcon className="w-10 h-10 text-white" />
          </Link>
        </div>

        {/* Thanh tìm kiếm ở giữa */}
        <div className="flex items-center justify-center flex-1">
          <Input
            type="text"
            className="w-60 rounded-md bg-main-palette-3 px-5 py-2"
            placeholder="Tìm kiếm"
          />
          <Button className="ml-2 rounded-md bg-main-palette-2 text-blue-400 hover:bg-main-palette-6 flex items-center">
            <SearchIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Icon thông báo và người dùng bên phải */}
        <div className="flex items-center gap-4 mr-6 relative">
          {/* Icon Notification */}
          <BellIcon className="w-6 h-6 text-white cursor-pointer" />

          {/* Icon User */}
          <div className="relative">
            <UserIcon
              className="w-6 h-6 text-white cursor-pointer"
              onClick={toggleMenu} // Sự kiện click để mở menu
            />
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                <Link to="/account/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Xem thông tin tài khoản
                </Link>
                <Link to="/dashboard/account/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Chỉnh sửa thông tin tài khoản
                </Link>
                <Link to='/login'>
                  <button
                    onClick={() => {
                      // Xử lý logic đăng xuất
                      console.log('Đăng xuất');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* <Link to="/login" className = 'ml-auto'>
          <Button className='border-2 bg-main-palette-4 p-2'>
            login page
          </Button>
        </Link> */}
      </div>
    </div>
    

  )
}

export const Route = createFileRoute('/dashboard/_layout')({
  component: DashboardLayoutPage,
})


