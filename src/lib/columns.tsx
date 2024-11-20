import { ColumnDef } from '@tanstack/react-table'

import { BasicUserInfo, BasicFeeInfo } from './types'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const statusOptions = [
  { value: 'active', label: 'Đã kích hoạt' },
  { value: 'inactive', label: 'Chưa kích hoạt' }
]

// TODO: Add editable columns
export const userInfoColumns: ColumnDef<BasicUserInfo & { size?: number }>[] = [
  {
    accessorKey: 'name',
    header: 'Họ và tên',
    meta: {
      headerClassName: 'max-w-[200px] min-w-[150px] w-[150px] overflow-hidden',
      cellClassName: 'max-w-[200px] min-w-[150px] w-[150px] overflow-hidden',
    }
  },
  {
    accessorKey: 'username',
    header: 'Username',
    meta: {
      headerClassName: 'w-[200px]',
      cellClassName: 'w-[200px]'
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      headerClassName: 'w-[300px]',
      cellClassName: 'w-[300px]'
    }
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
    header: 'Trạng thái',
    cell: ({ cell }) => {
      const status = cell.getValue() as string;

      return (
        <Select>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder={
              statusOptions.find((option) => option.value === status)?.label
            } />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
  }
]

export const feeColumns: ColumnDef<BasicFeeInfo>[] = [
  {
    accessorKey: 'name',
    header: 'Tên',
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền',
  },
  {
    accessorKey: 'due_date',
    header: 'Ngày thu',
  },
  {
    accessorKey: 'getFeeInfo',
    header: 'Thông tin',
    cell: ({ row }) => {
      const feeId = row.original.id.toString();

      return (
        <Link to='/dashboard/manager/info/$feeId' params={
          { feeId: feeId }
        }>
          <Button className='bg-main-palette-5 hover:bg-main-palette-6'>Thông tin</Button>
        </Link>
      )
    }
  },
  {
    accessorKey: 'deleteFee',
    header: 'Xoá',
    cell: ({ row }) => {
      const feeId = row.original.id.toString();

      return (
        <Link to='/dashboard/manager/delete/$feeId' params={
          { feeId: feeId }
        }>
          <Button className='bg-red-400 hover:bg-red-500'>Xoá</Button>
        </Link>
      )
    }
  }
]