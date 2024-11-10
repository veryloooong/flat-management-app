import { createFileRoute, redirect } from '@tanstack/react-router'

function AccountPage(): JSX.Element {
  const userInfo = Route.useLoaderData();

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-5xl flex justify-center mt-12 leading-none text-main-palette-5">Thông tin cá nhân</h3>
      </div>

      {/* TODO: write better UI */}

      <div className="p-16">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Họ và tên</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.name}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Tài khoản</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.username}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Số điện thoại</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.phone}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Địa chỉ Email</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.email}</dd>
          </div>
          {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Phòng số</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">$120,000</dd>
          </div> */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Loại tài khoản</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{
              userInfo.role === 'admin' ? 'Quản trị viên' : (
                userInfo.role === 'manager' ? 'Quản lý' : 'Người thuê'
              )
            }</dd>
          </div>
          {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Số chứng minh nhân dân</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Hà Nội</dd>
          </div> */}
        </dl>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/account/')({
  component: AccountPage,
  loader: async ({ context }) => {
    const userInfo = await context.authentication.getUserInfo();

    if (!userInfo) {
      throw redirect({
        to: '/login'
      })
    }

    return userInfo;
  }
})
