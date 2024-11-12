import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

import { BasicUserInfo } from './types'

// TODO: Add editable columns
export const columns: ColumnDef<BasicUserInfo>[] = [
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
  }
]
