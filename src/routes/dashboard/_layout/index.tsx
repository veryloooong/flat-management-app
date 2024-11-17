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

          {/* TODO: Lịch sử thu phí / Biểu đồ / whatever thằng Tùng vào làm ngay */}
          <div>
            <h3>Biểu đồ</h3>
          </div>
        </div>
        {/* News panel */}
        <div className='col-span-1 bg-blue-300'>
          <h3>Tin tức</h3>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/')({
  component: DashboardPage,
})
