import { toast } from '@/hooks/use-toast';

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { Header } from '@/components/header';

function DashboardLayoutPage(): JSX.Element {

  return (
    <div className='bg-main-palette-0 min-h-screen pt-20'>
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout')({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated } = context.authentication;

    const userInfo = await isAuthenticated();

    if (!userInfo) {
      toast({
        title: 'Vui lòng đăng nhập để truy cập trang này',
        description: 'Bạn sẽ được chuyển hướng về trang đăng nhập',
        variant: 'destructive',
      })

      throw redirect({ to: '/login' });
    }
  },
  component: DashboardLayoutPage,
})


