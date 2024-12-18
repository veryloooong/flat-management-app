import { ColumnDef } from "@tanstack/react-table";

import { BasicUserInfo, BasicFeeInfo, HouseholdInfo } from "./types";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { format } from "date-fns";
import { moneyFormatter } from "./utils";

const statusOptions = [
  { value: "active", label: "Đã kích hoạt" },
  { value: "inactive", label: "Chưa kích hoạt" },
];

// TODO: Add editable columns
export const userInfoColumns: ColumnDef<BasicUserInfo & { size?: number }>[] = [
  {
    accessorKey: "name",
    header: "Họ và tên",
    meta: {
      headerClassName: "max-w-[200px] min-w-[150px] w-[150px] overflow-hidden",
      cellClassName: "max-w-[200px] min-w-[150px] w-[150px] overflow-hidden",
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    meta: {
      headerClassName: "w-[200px]",
      cellClassName: "w-[200px]",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      headerClassName: "w-[300px]",
      cellClassName: "w-[300px]",
    },
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: (cell) => {
      const role = cell.getValue() as string;

      return (
        <span>
          {role === "admin"
            ? "Quản trị viên"
            : role === "manager"
              ? "Quản lý"
              : role === "tenant"
                ? "Người thuê"
                : "Khách"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ cell }) => {
      const status = cell.getValue() as string;
      const userId = cell.row.original.id.toString();
      const router = useRouter();

      return (
        <Select
          onValueChange={(value) => {
            invoke("update_user_status", {
              userId: Number(userId),
              status: value,
            })
              .then((_) => {
                toast({
                  title: "Đã cập nhật trạng thái",
                  description:
                    "Trạng thái người dùng đã được cập nhật thành công.",
                  duration: 2000,
                });

                router.invalidate();
              })
              .catch((err) => {
                console.error(err);
                toast({
                  title: "Có lỗi xảy ra",
                  description:
                    "Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.",
                  variant: "destructive",
                  duration: 2000,
                });
              });
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue
              placeholder={
                statusOptions.find((option) => option.value === status)?.label
              }
            />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
];

export const feeColumns: ColumnDef<BasicFeeInfo>[] = [
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "amount",
    header: "Số tiền",
    cell: ({ cell }) => {
      const amount = cell.getValue() as number;

      return <span>{moneyFormatter.format(amount)}</span>;
    },
  },
  {
    accessorKey: "due_date",
    header: "Ngày thu",
    cell: ({ cell }) => {
      const date = cell.getValue() as string;

      return <span>{format(date, "dd/MM/yyyy")}</span>;
    },
  },
  {
    accessorKey: "getFeeInfo",
    header: "Thông tin",
    cell: ({ row }) => {
      const feeId = row.original.id.toString();

      return (
        <Link to="/dashboard/fees/info/$feeId" params={{ feeId: feeId }}>
          <Button className="bg-main-palette-5 hover:bg-main-palette-6">
            Thông tin
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "deleteFee",
    header: "Xoá",
    cell: ({ row }) => {
      const feeId = row.original.id.toString();
      const [isOpen, setIsOpen] = useState(false);
      const router = useRouter();

      return (
        <Dialog open={isOpen}>
          <DialogTrigger
            asChild
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Xoá
            </Button>
          </DialogTrigger>
          <DialogContent className="[&>button]:hidden">
            <DialogTitle>Xóa khoản thu?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa khoản thu này không? Thao tác này không
              thể hoàn tác. Điều này sẽ xóa dữ liệu về khoản thu tới các hộ dân,
              và các thông tin về lịch sử thu.
            </DialogDescription>
            <DialogFooter>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  invoke("remove_fee", { id: Number(feeId) })
                    .then((_) => {
                      toast({
                        title: "Đã xóa khoản thu",
                        description: "Khoản thu đã được xóa thành công.",
                        duration: 2000,
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                      toast({
                        title: "Có lỗi xảy ra",
                        description:
                          "Không thể xóa khoản thu. Vui lòng thử lại sau.",
                        variant: "destructive",
                      });
                    })
                    .finally(() => {
                      setIsOpen(false);
                      router.invalidate();
                    });
                }}
              >
                Xóa khoản thu
              </Button>
              <DialogClose
                asChild
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <Button className="bg-gray-300 hover:bg-gray-400 text-black">
                  Hủy
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export const householdColumns: ColumnDef<HouseholdInfo>[] = [
  {
    accessorKey: "room_number",
    header: "Số phòng",
  },
  {
    accessorKey: "tenant_name",
    header: "Chủ hộ",
  },
  {
    accessorKey: "tenant_email",
    header: "Email",
  },
  {
    accessorKey: "tenant_phone",
    header: "Số điện thoại",
  },
];
