import { createFileRoute, Link } from '@tanstack/react-router'
import HomePageImage from '@/assets/homepage.jpg'

import '@/App.css'
import { Button } from '@/components/ui/button'
import { User, UserPlus } from 'lucide-react'

function HomePage(): JSX.Element {
  return (
    <div className="w-screen h-screen flex items-center">
      <img src={HomePageImage} alt="homepage" className="w-full h-full object-cover opacity-60 absolute top-0 left-0 -z-10" />

      <div className="flex flex-row gap-4 justify-between items-center w-full px-20 py-10 bg-main-palette-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl">Ứng dụng quản lý chung cư BlueMoon</h1>
          <p>
            Ứng dụng giúp quản lý về tài chính và thông tin cư dân trong chung cư BlueMoon
          </p>
        </div>

        <div className="flex flex-col gap-2 w-fit">
          <Link to="/login">
            <Button
              className="flex items-center justify-start gap-4 p-8 bg-main-palette-6 hover:bg-main-palette-7 text-white w-full"
            >
              <User size={24} /> <p className="text-lg">Đăng nhập</p>
            </Button>
          </Link>
          <Link to="/register">
            <Button
              className="flex items-center justify-start gap-4 p-8 bg-main-palette-4 hover:bg-main-palette-5 text-white w-full"
            >
              <UserPlus size={24} /> <p className="text-lg">Đăng ký</p>
            </Button>
          </Link>
        </div>
      </div>

    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
