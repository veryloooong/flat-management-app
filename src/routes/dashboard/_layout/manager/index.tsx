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
      <div className='w-4/5 mx-auto mt-8'>
        <DataTable columns={feeColumns} data={fees} />
        <Link to='/dashboard/manager/add'>
          <Button className='mt-4'>Thêm khoản thu</Button>
        </Link>
        <Link to='/dashboard/manager/delete'>
          <Button className='flex space-x-4 mt-4'>Xoá khoản thu</Button>
        </Link>
      </div>
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