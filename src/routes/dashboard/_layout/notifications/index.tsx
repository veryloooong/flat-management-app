import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Notification } from '@/lib/types'

function NotifyPage(): JSX.Element {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      from: 'hailong2004ptcnn@gmail.com',
      to: 'long.lh224873@sis.hust.edu.vn',
      content: 'Đây là nội dung thông báo đầu tiên.',
    },
    {
      id: 2,
      from: 'admin@example.com',
      to: 'user@example.com',
      content: 'Nội dung thông báo thứ hai.',
    },
    {
      id: 3,
      from: 'hailong2004ptcnn@gmail.com',
      to: 'long.lh224873@sis.hust.edu.vn',
      content: 'Đây là nội dung thông báo thứ ba.',
    },
    {
      id: 4,
      from: 'admin@example.com',
      to: 'user@example.com',
      content: 'Nội dung thông báo thứ tư.',
    },
  ])

  return (
    <div className=" bg-gray-100 p-4">
      <div className="flex gap-4 max-h-80 scroll-y">
        <div className="p-4 bg-white rounded-lg shadow-md max-h-[80vh] overflow-y-auto w-1/3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border-b pb-4 mb-4 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedNotification(notification)
              }}
            >
              <h2 className="font-bold text-lg">{notification.to}</h2>
              <p className="text-gray-500 truncate">{notification.content}</p>
            </div>
          ))}
        </div>

        {selectedNotification && (
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md ">
            <h2 className="font-bold text-xl mb-4">Chi tiết thông báo</h2>
            <p className="mb-2">
              <span className="font-medium">Từ:</span>{' '}
              {selectedNotification.from}
            </p>
            <p className="mb-2">
              <span className="font-medium">Đến:</span>{' '}
              {selectedNotification.to}
            </p>
            <p>
              <span className="font-medium">Nội dung:</span>
            </p>
            <p className="mt-2 bg-gray-100 p-4 rounded-lg">
              {selectedNotification.content}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/notifications/')({
  component: NotifyPage,
})
