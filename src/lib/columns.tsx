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
    accessorKey: 'name',
    header: 'Tên',
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền',
  }
]