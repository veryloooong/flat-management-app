import { toast } from '@/hooks/use-toast';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_layout/admin/_layout')({
  component: () => <Outlet />,
  beforeLoad: async ({ context }) => {
    const userInfo = await context.authentication.isAdmin();

    if (!userInfo) {
      toast({
        title: 'Không có quyền truy cập',
        description: 'Bạn không có quyền truy cập mục này',
        duration: 2000,
        variant: 'destructive',
      })

      throw redirect({ to: '/dashboard' });
    }
  }
})
