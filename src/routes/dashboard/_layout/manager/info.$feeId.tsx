import { toast } from '@/hooks/use-toast';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'

function ShowFeeInfoPage(): JSX.Element {
  return <div>Hello /dashboard/_layout/manager/info/$feeId!</div>
}

export const Route = createFileRoute('/dashboard/_layout/manager/info/$feeId')({
  component: ShowFeeInfoPage,
  loader: async ({ params }) => {
    try {
      const feeInfo = await invoke('get_fee_info', { feeId: params.feeId });
      return feeInfo;
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin khoản thu',
        variant: 'destructive'
      })

      throw redirect({
        to: '/dashboard/manager'
      })
    }
  }
})
