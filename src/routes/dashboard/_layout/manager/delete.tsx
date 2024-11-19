import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Fragment, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

function ConfirmDeletePage(): JSX.Element {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)

  function handleConfirm() {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      toast({
        title: 'Xóa thành công',
        description: 'Khoản thu đã được xóa.',
        duration: 3000,
      })
      navigate({
        to: '/dashboard',
      })
    }, 2000)
  }

  function handleCancel() {
    navigate({
      to: '/dashboard/manager',
    })
  }

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-xl font-bold">Xóa khoản thu</h1>
          <p className="mt-4 text-gray-600">
            Bạn có chắc chắn muốn xóa khoản thu này không? Thao tác này không
            thể hoàn tác.
          </p>
          <div className="flex justify-between mt-6">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Đồng ý'}
            </Button>
            <Button
              className="ml-4 bg-gray-300 hover:bg-gray-400 text-black"
              onClick={handleCancel}
              disabled={isDeleting}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export const Route = createFileRoute('/dashboard/_layout/manager/delete')({
  component: ConfirmDeletePage,
})
