import { FeesRoomInfo } from "@/lib/types";
import { useRouter } from "@tanstack/react-router";
import { format, add } from "date-fns";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { moneyFormatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import QRCode from "@/images/rickroll.png";

export const HouseholdFeeInfoTile = ({
  fee,
  isPaid,
}: {
  fee: FeesRoomInfo;
  isPaid: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handlePayment = () => {
    invoke("pay_fee", { feeId: fee.fee_id })
      .then(() => {
        toast({
          title: "Thanh toán thành công",
          description: `Đã thanh toán khoản phí ${fee.fee_name}`,
        });
        router.invalidate();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Lỗi thanh toán",
          description: `Không thể thanh toán khoản phí ${fee.fee_name}`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsDialogOpen(false);
      });

    setIsDialogOpen(false);
  };

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
            {format(
              add(new Date(fee.payment_date || ""), {
                hours: -new Date().getTimezoneOffset() / 60,
              }),
              "dd/MM/yyyy HH:mm:ss"
            )}
          </p>
        ) : (
          <p>Hạn nộp: {format(new Date(fee.due_date), "dd/MM/yyyy")}</p>
        )}
      </div>
      {!isPaid && (
        <Dialog open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Thanh toán</Button>
          </DialogTrigger>
          <DialogContent className="[&>button]:hidden">
            <DialogTitle>Thanh toán khoản phí</DialogTitle>
            <DialogDescription>
              Hiện tại không có liên kết với ngân hàng. Để demo thì bạn hãy quét
              QR code này coi như đã thanh toán. Sau khi quét xong thì nhấn nút
              thanh toán ở dưới. Hệ thống sẽ tự động cập nhật trạng thái khoản
              phí.
            </DialogDescription>

            <div className="flex justify-center">
              <img src={QRCode} alt="QR Code" className="w-64 h-64" />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
              </DialogClose>
              <Button onClick={handlePayment}>Thanh toán</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

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
          <h3 className="text-lg font-semibold">
            Phòng {fee.room_number} - {fee.fee_name}
          </h3>
        </div>
        {isPaid ? (
          <p>
            Đã nộp:{" "}
            {format(
              add(new Date(fee.payment_date || ""), {
                hours: -new Date().getTimezoneOffset() / 60,
              }),
              "dd/MM/yyyy HH:mm:ss"
            )}
          </p>
        ) : (
          <p>Hạn nộp: {format(new Date(fee.due_date), "dd/MM/yyyy")}</p>
        )}
      </div>
    </div>
  );
};
