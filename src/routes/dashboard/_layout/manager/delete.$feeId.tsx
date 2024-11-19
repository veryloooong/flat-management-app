import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Fragment, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { invoke } from '@tauri-apps/api/core';

function ConfirmDeletePage(): JSX.Element {
  const { feeId } = Route.useParams();

  const { toast } = useToast()
  const navigate = useNavigate()

  function handleConfirm() {
    invoke('remove_fee', { id: Number(feeId) })
      .then((_) => {
        toast({
          title: 'Đã xóa khoản thu',
          description: 'Khoản thu đã được xóa. Đang chuyển hướng về trang quản lý.',
          duration: 2000
        })
        setTimeout(() => {
          navigate({
            to: '/dashboard/manager',
          })
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: 'Có lỗi xảy ra',
          description: 'Không thể xóa khoản thu. Vui lòng thử lại sau.',
          variant: 'destructive'
        })
      })
  }

  function handleCancel() {
    navigate({
      to: '/dashboard/manager',
    })
  }

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-2/3">
          <h1 className="text-xl font-bold">Xóa khoản thu</h1>
          <p className="mt-4 text-gray-600">
            Bạn có chắc chắn muốn xóa khoản thu này không? Thao tác này không
            thể hoàn tác. Điều này sẽ xóa dữ liệu tới các hộ dân.
          </p>
          <div className="flex justify-between mt-6">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirm}
            >
              Đồng ý
            </Button>
            <Button
              className="ml-4 bg-gray-300 hover:bg-gray-400 text-black"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export const Route = createFileRoute(
  '/dashboard/_layout/manager/delete/$feeId',
)({
  component: ConfirmDeletePage,
})
