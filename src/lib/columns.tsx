import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

import { BasicUserInfo, FeeInfo } from './types'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

const CheckboxCell = () => {
  return <Checkbox />
}

// TODO: Add editable columns
export const userInfoColumns: ColumnDef<BasicUserInfo>[] = [
  {
    accessorKey: 'name',
    header: 'Họ và tên',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
  },
  {
    accessorKey: 'role',
    header: 'Vai trò',
    cell: (cell) => {
      const role = cell.getValue() as string;

      return (
        <span>
          {role === 'admin' ? 'Quản trị viên' :
            role === 'manager' ? 'Quản lý' :
              role === 'tenant' ? 'Người thuê' : 'Khách'}
        </span>
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Đã kích hoạt',
    cell: CheckboxCell,
  }
]

export const feeColumns: ColumnDef<FeeInfo>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Tên',
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền',
  },
  {
    accessorKey: 'collectFee',
    header: 'Thu phí',
    cell: () => {
      return (
        <Link to='/dashboard/manager/collect'>
          <Button className='bg-main-palette-5 hover:bg-main-palette-6'>Thu phí</Button>
        </Link>
      )
    }
  },
  {
    accessorKey: 'getFeeInfo',
    header: 'Thông tin',
    cell: ({ row }) => {
      const feeId = row.original.id.toString();

      return (
        <Link to='/dashboard/manager/info/$feeId' params={
          { feeId }
        }>
          <Button className='bg-main-palette-5 hover:bg-main-palette-6'>Thông tin</Button>
        </Link>
      )
    }
  }
]