import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { feeColumns } from "@/lib/columns";
import { BasicFeeInfo, FeesRoomInfo } from "@/lib/types";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { add, format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { addFeeSchema } from "@/lib/add-fee";
import { Label } from "@/components/ui/label";

import { Jimp } from "jimp";
import jsQR from "jsqr";

async function handleQRCodeUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const image = await Jimp.read(URL.createObjectURL(file));
    const imageData = {
      data: new Uint8ClampedArray(image.bitmap.data),
      width: image.bitmap.width,
      height: image.bitmap.height,
    };
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (!code) {
      toast({
        title: "Không tìm thấy mã QR",
        description: "Vui lòng thử lại với một ảnh khác.",
        duration: 2000,
        variant: "destructive",
      });
      return;
    }

    const qrData = code.data;
    return qrData;
  } catch (err) {
    console.error(err);
    return;
  }
}

function FeesPage(): JSX.Element {
  const fees = Route.useLoaderData();
  const router = useRouter();
  const [isAddFeeDialogOpen, setIsAddFeeDialogOpen] = useState(false);
  const [qrInfo, setQRInfo] = useState<FeesRoomInfo | null>(null);

  const addFeeForm = useForm<z.infer<typeof addFeeSchema>>({
    resolver: zodResolver(addFeeSchema),
    defaultValues: {
      name: "",
      amount: 0,
      due_date: add(new Date(), { months: 1 }),
      is_required: true,
      is_recurring: false,
      recurrence_type: "weekly",
    },
  });

  function onSubmitAddFeeForm(data: z.infer<typeof addFeeSchema>) {
    console.log(data);

    let info = {
      name: data.name,
      amount: data.amount,
      due_date: format(data.due_date, "yyyy-MM-dd'T'HH:mm:ss"),
      is_required: data.is_required,
      recurrence_type: data.is_recurring ? data.recurrence_type : null,
    };

    invoke("add_fee", { info })
      .then((_) => {
        addFeeForm.reset();
        toast({
          title: "Thêm khoản thu thành công!",
          duration: 2000,
        });
      })
      .catch((err) => {
        toast({
          title: "Thêm khoản thu thất bại!",
          description: err,
          duration: 2000,
          variant: "destructive",
        });
      })
      .finally(() => {
        addFeeForm.reset();
        setIsAddFeeDialogOpen(false);
        router.invalidate();
      });
  }

  return (
    <div>
      <h1 className="text-center">Quản lý các khoản thu</h1>
      <div className="w-4/5 mx-auto mt-8">
        <DataTable columns={feeColumns} data={fees} className="bg-white" />
        <div className="flex flex-row space-x-4 items-center">
          <Dialog open={isAddFeeDialogOpen}>
            <DialogTrigger
              onClick={() => {
                setIsAddFeeDialogOpen(true);
              }}
            >
              <Button className="bg-main-palette-5 hover:bg-main-palette-6 text-white p-2">
                Thêm khoản thu
              </Button>
            </DialogTrigger>
            <DialogContent className="[&>button]:hidden">
              <DialogTitle>Thêm khoản thu</DialogTitle>
              <DialogDescription>
                Điền thông tin khoản thu và nhấn "Thêm" để thêm khoản thu mới.
              </DialogDescription>
              <Form {...addFeeForm}>
                <form
                  onSubmit={addFeeForm.handleSubmit(onSubmitAddFeeForm)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    name="name"
                    control={addFeeForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên khoản thu</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage>
                          {addFeeForm.formState.errors.name?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="amount"
                    control={addFeeForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tiền</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                        <FormMessage>
                          {addFeeForm.formState.errors.amount?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="due_date"
                    control={addFeeForm.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Ngày thu</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage>
                          {addFeeForm.formState.errors.due_date?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row gap-4 justify-start">
                    <FormField
                      name="is_required"
                      control={addFeeForm.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Có bắt buộc?</FormLabel>
                          <FormMessage>
                            {addFeeForm.formState.errors.is_required?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="is_recurring"
                      control={addFeeForm.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Có định kỳ?</FormLabel>
                          <FormMessage>
                            {addFeeForm.formState.errors.is_recurring?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  {addFeeForm.watch("is_recurring") && (
                    <FormField
                      name="recurrence_type"
                      control={addFeeForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Định kỳ</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chu kỳ lặp lại" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weekly">
                                  Hàng tuần
                                </SelectItem>
                                <SelectItem value="monthly">
                                  Hàng tháng
                                </SelectItem>
                                <SelectItem value="yearly">Hàng năm</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage>
                            {
                              addFeeForm.formState.errors.recurrence_type
                                ?.message
                            }
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  )}
                </form>
              </Form>
              <DialogFooter>
                <Button
                  onClick={() => {
                    addFeeForm.handleSubmit(onSubmitAddFeeForm)();
                  }}
                  className="bg-main-palette-5 hover:bg-main-palette-6"
                >
                  Thêm
                </Button>
                <Button onClick={() => setIsAddFeeDialogOpen(false)}>
                  Đóng
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="p-2">Quét QR</Button>
            </DialogTrigger>
            <DialogContent className="[&>button]:hidden">
              <DialogTitle>Quét QR thông tin khoản thu</DialogTitle>
              <DialogDescription>
                Quét mã QR cho hộ dân cung cấp để biết thông tin về việc thanh
                toán của hộ với khoản đó.
              </DialogDescription>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="qr-code">Mã QR</Label>
                <Input
                  id="qr-code"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleQRCodeUpload(e).then((data) => {
                      if (!data) return;
                      console.log(data);
                      setQRInfo(JSON.parse(data));
                    });
                  }}
                />
              </div>

              {qrInfo && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold mt-4">
                    Thông tin khoản thu
                  </h2>
                  <div className="grid grid-cols-2 gap-1.5 text-sm place-content-center">
                    <Label>Tên khoản thu</Label>
                    <span>{qrInfo.fee_name}</span>
                    <Label>Số tiền</Label>
                    <span>{qrInfo.fee_amount}</span>
                    <Label>Hạn thu</Label>
                    <span>
                      {format(new Date(qrInfo.due_date), "dd/MM/yyyy")}
                    </span>
                    <Label>Số phòng</Label>
                    <span>{qrInfo.room_number}</span>
                    <Label>Đã thanh toán?</Label>
                    <span>
                      {qrInfo.is_paid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                    {qrInfo.payment_date && (
                      <>
                        <Label>Thời gian thanh toán</Label>
                        <span>
                          {format(
                            new Date(qrInfo.payment_date),
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={() => {
                      setQRInfo(null);
                    }}
                  >
                    Đóng
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/fees/")({
  component: FeesPage,
  loader: async (_) => {
    try {
      const fees = (await invoke("get_fees")) as BasicFeeInfo[];
      return fees;
    } catch {
      return [];
    }
  },
});
