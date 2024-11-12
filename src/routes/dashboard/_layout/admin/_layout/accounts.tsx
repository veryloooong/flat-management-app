import { BasicUserInfo } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'
import { userInfoColumns } from '@/lib/columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';

function AdminAccountsPage(): JSX.Element {
  const users = Route.useLoaderData();

  return (
    <div className="w-screen pt-8">
      <h1 className="text-center">Các tài khoản người dùng</h1>

      <div className="w-4/5 mx-auto mt-8 flex flex-col gap-4">
        <DataTable columns={userInfoColumns} data={users} />
        <Button
          className="w-fit self-end bg-main-palette-4 hover:bg-main-palette-5"
          onClick={() => console.log("TODO update account activation status")}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  )
}

export const Route = createFileRoute(
  '/dashboard/_layout/admin/_layout/accounts',
)({
  component: AdminAccountsPage,
  loader: async ({ }) => {
    try {
      const response = await invoke('get_all_users');
      const users = response as BasicUserInfo[];

      return users;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
})
