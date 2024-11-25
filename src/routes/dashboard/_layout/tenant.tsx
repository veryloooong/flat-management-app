import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

const InfoTile = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-2 flex-grow">
      <h3>{title}</h3>
      {children}
    </div>
  );
};

function DashboardPage(): JSX.Element {
  const newsItems = [
    {
      title: "Thông báo đóng tiền điện chung cư tháng 10/2024",
      date: "13/11/2024",
    },
    {
      title: "Thông báo đóng quỹ thiện nguyện tháng 11/2024",
      date: "7/11/2024",
    },
    {
      title: "Yêu cầu chung đến mọi người trong chung cư",
      date: "5/11/2024",
    },
    {
      title: "Thông báo đóng tiền gửi xe tháng 11/2024",
      date: "29/10/2024",
    },
  ];

  return (
    <div className="w-screen">
      <h1 className="text-center">Dashboard</h1>
      <div className="grid grid-cols-2 px-4 gap-x-4 items-start h-full gap-y-6">
        {/* Fees and homes panel */}
        <div className="bg-white p-4 rounded-lg shadow-md border-2 flex flex-col h-full">
          <div className="mt-4 flex-grow overflow-hidden">
            <h3 className="font-semibold mb-4 sticky top-0 bg-white z-10">
              Lịch sử nộp phí
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-60">
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Số tiền: 500.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Số tiền: 690.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
            </div>
          </div>
        </div>

        {/* News panel */}
        <div className="border-2 rounded-md p-4 shadow-md bg-white flex flex-col h-full">
          <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-400">
            Tin tức
          </h3>
          <ul className="space-y-3 flex-grow">
            <li>Tính năng đang được phát triển</li>
          </ul>
          <div className="mt-4">
            <Link to="/dashboard/news">
              <Button variant="link">Xem thêm</Button>
            </Link>
          </div>
        </div>

        <div className="bg-main-palette-1 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 ">
            Các khoản cần đóng
          </h2>
          <div className="bg-main-palette-3 rounded-lg p-6 shadow-md overflow-y-auto max-h-60">
            <div className="bg-white p-4 rounded-lg mb-4  shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-yellow-600">⚠️</span>
                <h3 className="text-lg font-semibold">
                  Tiền điện tháng 12/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 500.000 VND</p>
              <p>Hạn nộp: 29/12/2024 23:59:59</p>
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
              <p>Hạn nộp: 30/12/2024 23:59:59</p>
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
              <p>Ngày nộp: 30/11/2024 23:59:59</p>
            </div>
          </div>
        </div>

        <div className="bg-main-palette-1 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 ">
            Các khoản đã đóng
          </h2>
          <div className="bg-main-palette-3 rounded-lg p-6 shadow-md overflow-y-auto max-h-60">
            <div className="bg-white p-4 rounded-lg mb-4  shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-green-600">✅</span>
                <h3 className="text-lg font-semibold">
                  Tiền điện tháng 12/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 500.000 VND</p>
              <p>Ngày nộp: 29/12/2024 17:00:20</p>
            </div>
            <div className="bg-white p-4 rounded-lg mb-4 shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-green-600">✅</span>
                <h3 className="text-lg font-semibold">
                  Tiền nước tháng 12/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 300.000 VND</p>
              <p>Ngày nộp: 30/12/2024 19:01:13</p>
            </div>
            <div className="bg-white p-4 rounded-lg mb-4 shadow">
              <div className="flex items-center mb-2 border-b">
                <span className="mr-2 text-green-600">✅</span>
                <h3 className="text-lg font-semibold">
                  Tiền điện tháng 11/2024
                </h3>
              </div>
              <p>Phòng: 169</p>
              <p>Số tiền: 400.000 VND</p>
              <p>Ngày nộp: 30/11/2024 20:15:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/tenant")({
  component: DashboardPage,
});
