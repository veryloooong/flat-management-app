import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { feeColumns } from '@/lib/columns';
import { BasicFeeInfo } from '@/lib/types';
import { createFileRoute, Link } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'

function FeesPage(): JSX.Element {
  const fees = Route.useLoaderData();

  return (
    <div className='w-screen pt-8'>
      <h1 className='text-center'>Quản lý các khoản thu</h1>
      <div className='w-4/5 mx-auto mt-8 h-40'>
        <DataTable columns={feeColumns} data={fees} className="bg-white w-full h-full" />
      </div>
      <Link to='/dashboard/manager/add'>
        <Button className='mt-4'>Thêm khoản thu</Button>
      </Link>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/manager/')({
  component: FeesPage,
  loader: async (_) => {
    try {
      const fees = await invoke('get_fees') as BasicFeeInfo[];
      return fees;
    } catch {
      return [];
    }
  }
})
