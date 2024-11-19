import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

const InfoTile = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className='bg-white p-4 rounded-lg shadow-md flex-grow'>
      <h3>{title}</h3>
      {children}
    </div>
  )
}

function DashboardPage(): JSX.Element {
  const newsItems = [
    {
      title: 'Thông báo đóng tiền điện chung cư tháng 10/2024',
      date: '13/11/2024',
    },
    {
      title: 'Thông báo đóng quỹ thiện nguyện tháng 11/2024',
      date: '7/11/2024',
    },
    {
      title: 'Yêu cầu chung đến mọi người trong chung cư',
      date: '5/11/2024',
    },
    {
      title: 'Thông báo đóng tiền gửi xe tháng 11/2024',
      date: '29/10/2024',
    },
  ];
  return (
    <div className="w-screen pt-6">
      <h1 className='text-center'>Dashboard</h1>
      <div className='grid grid-cols-3 px-4 gap-x-2'>
        {/* Fees and homes panel */}
        <div className='col-span-2 bg-pink-300'>
          <div className='flex flex-row w-full items-center gap-2'>
            <InfoTile title='Khoản thu'>
              <p>100</p>
              <Link to='/dashboard/manager'>
                <Button>Xem chi tiết</Button>
              </Link>
            </InfoTile>
            <InfoTile title='Cư dân'>
              <p>100</p>
              <Link to='/dashboard/homes'>
                <Button>Xem chi tiết</Button>
              </Link>
            </InfoTile>
          </div>

          {/* TODO: Lịch sử thu phí */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-4 max-h-80">
            <h3 className="font-semibold mb-4 sticky top-0 bg-white z-10">Lịch sử thu phí</h3>
            <div className="space-y-4 overflow-y-auto max-h-60">
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Phòng: 701</p>
                <p>Số tiền: 500.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Phòng: 701</p>
                <p>Số tiền: 500.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Phòng: 703</p>
                <p>Số tiền: 690.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Phòng: 302</p>
                <p>Số tiền: 5.000.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
            </div>
          </div>
        </div>
        {/* News panel */}
        <div className='col-span-1 bg-blue-300 p-4'>
      <h3 className='text-lg font-bold mb-4 border-b-2 border-gray-400'>Tin tức</h3>
      <ul className='space-y-3'>
        {newsItems.map((item, index) => (
          <li key={index} className='flex justify-between border-b pb-2'>
            <span className='text-sm font-medium'>{item.title}</span>
            <span className='text-xs text-gray-500'>{item.date}</span>
          </li>
        ))}
      </ul>
      <div className='mt-4'>
        <a href='#' className='text-blue-600 hover:underline text-sm'>Xem thêm</a>
      </div>
    </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/')({
  component: DashboardPage,
})
