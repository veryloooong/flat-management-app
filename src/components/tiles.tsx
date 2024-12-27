import { FeesRoomInfo } from "@/lib/types";
import { useRouter } from "@tanstack/react-router";
import { format, add } from "date-fns";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { moneyFormatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "qrcode";

import RickrollQRCode from "@/images/rickroll.png";

export const HouseholdFeeInfoTile = ({
  fee,
  isPaid,
}: {
  fee: FeesRoomInfo;
  isPaid: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [qrCode, setQRCode] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(JSON.stringify(fee)).then(setQRCode);
  }, [fee]);

  const handlePayment = () => {
    invoke("check_payment", { id: fee.assignment_id })
      .then((res) => {
        if (res) {
          toast({
            title: "Thanh toán thành công",
            duration: 2000,
          });
          setIsDialogOpen(false);
          router.invalidate();
        } else {
          toast({
            title: "Thanh toán thất bại",
            variant: "destructive",
            duration: 2000,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Đã xảy ra lỗi khi thanh toán",
          variant: "destructive",
          duration: 2000,
        });
      });
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

            <div className="flex flex-col w-full justify-center items-center space-y-4">
              <div className="flex flex-col items-center w-full">
                <p className="text-sm w-3/4 text-center">
                  Mã QR dưới dùng để xuất thông tin ra. Ban quản trị có thể quét
                  QR để xác nhận thông tin.
                </p>
                <img
                  src={qrCode || RickrollQRCode}
                  alt="QR Code"
                  className="w-36 h-36"
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <p className="text-sm w-3/4 text-center">
                  Quét mã QR dưới để thanh toán trực tiếp. Sau khi thanh toán,
                  nhấn nút kiểm tra bên dưới để xác nhận.
                </p>
                {/* https://qr.sepay.vn/img?acc=29052004101&bank=TPBank&amount=100000&des=FLATAPP1 */}
                <img
                  src={`https://qr.sepay.vn/img?acc=29052004101&bank=TPBank&amount=${fee.fee_amount}&des=FLATAPP${fee.assignment_id}`}
                  alt="QR Code"
                  className="w-36 h-36"
                />
              </div>
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
              <Button onClick={handlePayment}>Kiểm tra</Button>
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
