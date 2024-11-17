import { toast } from '@/hooks/use-toast';
import { DetailedFeeInfo } from '@/lib/types';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'

function ShowFeeInfoPage(): JSX.Element {
  const feeInfo: DetailedFeeInfo = Route.useLoaderData();

  return (
    <div>
      <h1>Thông tin khoản thu</h1>
      <div>
        <p>ID: {feeInfo.id}</p>
        <p>Tên khoản thu: {feeInfo.name}</p>
        <p>Giá: {feeInfo.amount}</p>
        <p>Ngày tạo: {feeInfo.created_at}</p>
        <p>Ngày thu: {feeInfo.collected_at}</p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/manager/info/$feeId')({
  component: ShowFeeInfoPage,
  loader: async ({ params }) => {
    try {
      const feeInfo = await invoke('get_fee_info', { feeId: Number(params.feeId) });
      return feeInfo;
    } catch (err) {
      console.error(err)
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
