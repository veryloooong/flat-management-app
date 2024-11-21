import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { DetailedFeeInfo } from "@/lib/types";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

function ShowFeeInfoPage(): JSX.Element {
  const feeInfo: DetailedFeeInfo = Route.useLoaderData();

  const paidHouseholds = [
    //  FIX ME
    { room: "701", amount: "500.000 VND", paymentDate: "29/11/2024 18:51:20" },
    { room: "803", amount: "500.000 VND", paymentDate: "29/11/2024 17:00:20" },
    { room: "210", amount: "500.000 VND", paymentDate: "29/11/2024 08:11:59" },
  ];

  const unpaidHouseholds = [
    // FIX ME
    { room: "203", amount: "500.000 VND", dueDate: "04/12/2024" },
    { room: "204", amount: "500.000 VND", dueDate: "04/12/2024" },
    { room: "205", amount: "500.000 VND", dueDate: "04/12/2024" },
  ];

  return (
    <div className="w-screen p-8 bg-gray-100">
      {/* Navigation Back */}
      <Link to="/dashboard/manager">
        <Button>Quay lại</Button>
      </Link>

      <h1 className="text-center text-2xl font-bold mt-4">
        Thông tin khoản thu
      </h1>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Fee Information Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Thông tin khoản thu</h2>
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Tên khoản thu:</label>
              <p className="text-gray-700">{feeInfo.name}</p>
            </div>
            <div>
              <label className="font-semibold">Số tiền:</label>
              <p className="text-gray-700">{feeInfo.amount}</p>
            </div>
            <div>
              <label className="font-semibold">Ngày bắt đầu thu:</label>
              <p className="text-gray-700">{feeInfo.created_at}</p>
            </div>
            <div>
              <label className="font-semibold">Hạn nộp:</label>
              <p className="text-gray-700">{feeInfo.due_date}</p>
            </div>
            <div>
              <label className="font-semibold">Bắt buộc:</label>
              <p className="text-gray-700">
                {feeInfo.is_required ? "Có" : "Không"}
              </p>
            </div>
          </div>
        </div>

        {/* Households Lists */}
        <div className="space-y-8">
          {/* Paid Households */}
          <div className="bg-gray-200 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">
              Danh sách hộ đã nộp khoản thu
              <Button style={{ float: "right", background: "white" }}>
                <i className="text-blue-500">🔍</i>
              </Button>
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-60">
              <div className="space-y-2">
                {paidHouseholds.map((house, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 shadow rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">Phòng: {house.room}</p>
                      <p>Số tiền: {house.amount}</p>
                      <p>Ngày giao dịch: {house.paymentDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unpaid Households */}
          <div className="bg-gray-200 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">
              Danh sách hộ chưa nộp khoản thu
              <Button style={{ float: "right", background: "white" }}>
                <i className="text-blue-500">🔍</i>
              </Button>
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-60">
              <div className="space-y-2">
                {unpaidHouseholds.map((house, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 shadow rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">Phòng: {house.room}</p>
                      <p>Số tiền: {house.amount}</p>
                      <p>Hạn nộp: {house.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/manager/info/$feeId")({
  component: ShowFeeInfoPage,
  loader: async ({ params }) => {
    try {
      const feeInfo = await invoke("get_fee_info", {
        feeId: Number(params.feeId),
      });
      return feeInfo;
    } catch (err) {
      console.error(err);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin khoản thu",
        variant: "destructive",
      });

      throw redirect({
        to: "/dashboard/manager",
      });
    }
  },
});
