import { PersonalHouseholdInfo } from "@/lib/types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

// TODO: hoàn thành trang xem thông tin hộ gia đình và các khoản thu được gán (frontend thôi)
function HouseholdInfoPage(): JSX.Element {
  const { householdInfo } = Route.useLoaderData();

  return (
    <div className="flex flex-col md:flex-row px-6 pb-6 space-x-4">
      {/* Resident Information Section */}
      <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold text-main-palette-7 mb-6">
          Thông tin cư trú
        </h1>
        <div className="mb-4 flex border-b justify-between">
          <label className="block font-semibold">Họ và tên</label>
          <p className="text-gray-700">{householdInfo.name}</p>
        </div>
        {/* TODO: add more information to household */}
        {/* <div className="mb-4 flex border-b justify-between">
          <label className="block font-semibold">Số CCCD</label>
          <p className="text-gray-700">001204021234</p>
        </div>
        <div className="mb-4 flex border-b justify-between">
          <label className="block font-semibold">Giới tính</label>
          <p className="text-gray-700">Nam</p>
        </div> */}
        <div className="mb-4 flex border-b justify-between">
          <label className="block font-semibold">Chủ hộ phòng</label>
          <p className="text-gray-700">{householdInfo.room_number}</p>
        </div>
      </div>

      {/* TODO: add payment info and option to pay */}
      {/* Payment and Transaction Sections */}
      <div className="flex-1 space-y-6">
        {/* Pending Payment Section with Scrollable Area */}
        <div className="bg-main-palette-1 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 ">
            Các khoản cần đóng
          </h2>
          <div className="bg-main-palette-3 rounded-lg p-6 shadow-md overflow-y-auto max-h-96">
            <div className="bg-white p-4 rounded-lg mb-4  shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-yellow-600">⚠️</span>
                <h3 className="text-lg font-semibold">
                  Tiền điện tháng 12/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 500.000 VND</p>
              <p>Hạn nộp 29/12/2024 17:00:20</p>
            </div>
            <div className="bg-white p-4 rounded-lg mb-4 shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-yellow-600">⚠️</span>
                <h3 className="text-lg font-semibold">
                  Tiền nước tháng 12/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 300.000 VND</p>
              <p>Hạn nộp 30/12/2024 19:01:13</p>
            </div>
            <div className="bg-white p-4 rounded-lg mb-4 shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-yellow-600">⚠️</span>
                <h3 className="text-lg font-semibold">
                  Tiền điện tháng 11/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 400.000 VND</p>
              <p>Ngày giao dịch: 30/11/2024 20:15:00</p>
            </div>
          </div>
        </div>
        {/* Transaction History Section with Scrollable Area */}
        <div className="bg-main-palette-1 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Lịch sử giao dịch
          </h2>
          <div className="bg-main-palette-3 rounded-lg p-6 shadow-md overflow-y-auto max-h-96">
            <div className="bg-white p-4 rounded-lg mb-4 shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-green-600">✅</span>
                <h3 className="text-lg font-semibold">
                  Tiền quỹ thiện nguyện tháng 11/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 200.000 VND</p>
              <p>Ngày giao dịch: 29/11/2024 17:00:20</p>
            </div>
            <div className="bg-white p-4 rounded-lg mb-4 shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-green-600">✅</span>
                <h3 className="text-lg font-semibold">
                  Tiền điện tháng 11/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 300.000 VND</p>
              <p>Ngày giao dịch: 30/11/2024 19:01:13</p>
            </div>
            <div className="bg-white p-4 rounded-lg mb-4 shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-green-600">✅</span>
                <h3 className="text-lg font-semibold">
                  Tiền nước tháng 11/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 150.000 VND</p>
              <p>Ngày giao dịch: 01/12/2024 09:30:45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/household/")({
  component: HouseholdInfoPage,
  loader: async ({}) => {
    try {
      const householdInfo =
        await invoke<PersonalHouseholdInfo>("get_household_info");
      return { householdInfo };
    } catch (error) {
      console.error(error);
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
