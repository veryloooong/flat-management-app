import { Button } from "@/components/ui/button";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

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
  const { role } = Route.useLoaderData();

  return (
    <div className="w-screen">
      <h1 className="text-center">Dashboard</h1>
      <div className="grid grid-cols-3 px-4 gap-x-2">
        {/* Fees and homes panel */}
        <div className="col-span-2 space-y-2">
          {role !== "tenant" && (
            <div className="flex flex-row w-full items-center gap-2">
              <InfoTile title="Khoản thu">
                <Link to="/dashboard/fees">
                  <Button>Xem chi tiết</Button>
                </Link>
              </InfoTile>
              <InfoTile title="Cư dân">
                <Link to="/dashboard/homes">
                  <Button>Xem chi tiết</Button>
                </Link>
              </InfoTile>
            </div>
          )}

          {/* TODO: Lịch sử thu phí */}
          <div className="bg-white p-4 rounded-lg shadow-md max-h-80 border-2">
            <h3 className="font-semibold mb-4 sticky top-0 bg-white z-10">
              Lịch sử thu phí
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-60">
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Phòng: 701</p>
                <p>Số tiền: 500.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Phòng: 701</p>
                <p>Số tiền: 500.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Phòng: 703</p>
                <p>Số tiền: 690.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-medium">Tiền điện tháng 11/2024</p>
                <p>Phòng: 302</p>
                <p>Số tiền: 5.000.000 VND</p>
                <p>Ngày giao dịch: 29/11/2024 18:51:20</p>
              </div>
            </div>
          </div>
        </div>

        {/* News panel */}
        <div className="col-span-1 border-2 rounded-md p-4 shadow-md bg-white">
          <h3 className="text-lg font-bold mb-4 border-b-2 border-gray-400">
            Tin tức
          </h3>
          <ul className="space-y-3">
            <li>Tính năng đang được phát triển</li>
          </ul>
          <div className="mt-4">
            <Link to="/dashboard/news">
              <Button variant="link">Xem thêm</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/")({
  component: DashboardPage,
  loader: async ({ context }) => {
    const role = await context.authentication.getRole();
    if (role === undefined) {
      throw redirect({ to: "/login" });
    }

    return {
      role,
    };
  },
});
