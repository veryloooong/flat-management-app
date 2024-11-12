import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

import { BasicUserInfo, FeeInfo } from './types'

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
  },
  {
    accessorKey: 'status',
    header: 'Đã kích hoạt',
    cell: CheckboxCell,
  }
]

export const feeColumns: ColumnDef<FeeInfo>[] = [
  {
    accessorKey: 'name',
    header: 'Tên',
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền',
  }
]