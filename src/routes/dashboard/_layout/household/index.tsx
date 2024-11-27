import { PersonalHouseholdInfo } from "@/lib/types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

import { HouseholdFeeInfoTile } from "@/components/tiles";

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
              <HouseholdFeeInfoTile fee={fee} isPaid={false} />
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
              <HouseholdFeeInfoTile fee={fee} isPaid={true} />
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
