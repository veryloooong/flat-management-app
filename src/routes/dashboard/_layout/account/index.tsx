import { createFileRoute, redirect } from "@tanstack/react-router";

function AccountPage(): JSX.Element {
  const userInfo = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:px-10">
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Thông tin cá nhân
          </h3>

          <div className="divide-y divide-gray-200">
            {[
              { label: "Họ và tên", value: userInfo.name, icon: "👤" },
              { label: "Tài khoản", value: userInfo.username, icon: "💻" },
              { label: "Số điện thoại", value: userInfo.phone, icon: "📞" },
              { label: "Địa chỉ Email", value: userInfo.email, icon: "✉️" },
              {
                label: "Loại tài khoản",
                value:
                  userInfo.role === "admin"
                    ? "Quản trị viên"
                    : userInfo.role === "manager"
                    ? "Quản lý"
                    : "Người thuê",
                icon: "🔑",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center py-4 sm:grid sm:grid-cols-3 sm:gap-4"
              >
                <div className="text-lg font-medium text-gray-700 flex items-center">
                  <span className="mr-2 text-xl">{item.icon}</span>
                  {item.label}
                </div>
                <div className="mt-1 text-base text-gray-600 sm:col-span-2 sm:mt-0">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/account/")({
  component: AccountPage,
  loader: async ({ context }) => {
    const userInfo = await context.authentication.getUserInfo();

    if (!userInfo) {
      throw redirect({
        to: "/login",
      });
    }

    return userInfo;
  },
});
