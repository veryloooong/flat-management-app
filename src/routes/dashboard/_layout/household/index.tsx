import { FeesRoomInfo, PersonalHouseholdInfo } from "@/lib/types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { format } from "date-fns";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { moneyFormatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const FeeInfoTile = ({
  fee,
  isPaid,
}: {
  fee: FeesRoomInfo;
  isPaid: boolean;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg mb-4 shadow flex flex-row justify-between items-end">
      <div>
        <div className="flex items-center mb-2 border-b">
          <h3 className="text-lg font-semibold">{fee.fee_name}</h3>
        </div>
        <p>Số tiền: {moneyFormatter.format(fee.fee_amount)}</p>
        {isPaid ? (
          <p>
            Đã nộp:{" "}
            {format(new Date(fee.payment_date || ""), "dd/MM/yyyy HH:mm:ss")}
          </p>
        ) : (
          <p>
            Hạn nộp: {format(new Date(fee.due_date), "dd/MM/yyyy")}
          </p>
        )}
      </div>
      {/* TODO: add thanh toan function */}
      {!isPaid && <Button>Thanh toán</Button>}
    </div>
  );
};

// TODO: hoàn thành trang xem thông tin hộ gia đình và các khoản thu được gán (frontend thôi)
function HouseholdInfoPage(): JSX.Element {
  const { householdInfo } = Route.useLoaderData();
  const [paidFees, setPaidFees] = useState<PersonalHouseholdInfo["fees"]>([]);
  const [unpaidFees, setUnpaidFees] = useState<PersonalHouseholdInfo["fees"]>(
    []
  );

  // run once to separate paid and unpaid fees
  useEffect(() => {
    const [paid, unpaid] = householdInfo.fees.reduce(
      (acc, fee) => {
        if (fee.payment_date) {
          acc[0].push(fee);
        } else {
          acc[1].push(fee);
        }
        return acc;
      },
      [[], []] as [PersonalHouseholdInfo["fees"], PersonalHouseholdInfo["fees"]]
    );

    setPaidFees(paid);
    setUnpaidFees(unpaid);
  }, [householdInfo.fees]);

  return (
    <div className="flex flex-col md:flex-row px-6 pb-6 space-x-4">
      {/* Resident Information Section */}
      <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold text-main-palette-7 mb-6">
          Thông tin cư trú
        </h1>
        <div className="mb-4 flex border-b justify-between">
          <label className="block font-semibold">Họ và tên</label>
          <p className="text-gray-700">{householdInfo.tenant_name}</p>
        </div>
        <div className="mb-4 flex border-b justify-between">
          <label className="block font-semibold">Chủ hộ phòng</label>
          <p className="text-gray-700">{householdInfo.room_number}</p>
        </div>

        <h1 className="text-3xl font-bold text-main-palette-7 mb-6">
          Thông tin liên lạc
        </h1>
        <div className="mb-4 flex border-b justify-between">
          <label className="block font-semibold">Số điện thoại</label>
          <p className="text-gray-700">{householdInfo.tenant_phone}</p>
        </div>
        <div className="mb-4 flex border-b justify-between">
          <label className="block font-semibold">Email</label>
          <p className="text-gray-700">{householdInfo.tenant_email}</p>
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
            {unpaidFees.map((fee) => (
              <FeeInfoTile fee={fee} isPaid={false} />
            ))}
          </div>
        </div>
        {/* Transaction History Section with Scrollable Area */}
        <div className="bg-main-palette-1 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Lịch sử giao dịch
          </h2>
          <div className="bg-main-palette-3 rounded-lg p-6 shadow-md overflow-y-auto max-h-96">
            {paidFees.map((fee) => (
              <FeeInfoTile fee={fee} isPaid={true} />
            ))}
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

      toast({
        title: "Lỗi tải thông tin",
        description: "Không thể tải thông tin hộ gia đình",
        variant: "destructive",
      });

      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
