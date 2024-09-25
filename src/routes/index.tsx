import { createFileRoute, Link } from '@tanstack/react-router'
import HomePageImage from '@/assets/homepage.jpg'

import '@/App.css'
import { Button } from '@/components/ui/button'

function HomePage(): JSX.Element {
  return (
    <div className="w-screen max-h-48">
      <img src={HomePageImage} alt="homepage" className="w-full h-full object-cover opacity-60 absolute top-0 left-0 -z-10" />
      <h1>Ứng dụng quản lý chung cư BlueMoon</h1>
      <Link to="/login">
        <Button
          className=""
        >
          Đăng nhập
        </Button>
      </Link>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
