import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { DetailedFeeInfo } from "@/lib/types";

import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, moneyFormatter } from "@/lib/utils";
import { CalendarIcon, ChevronLeftIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { MultipleSelector, Option } from "@/components/ui/multi-select";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { addFeeSchema } from "@/lib/add-fee";
import { FeeInfoTile } from "@/components/tiles";

const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const collectFeeSchema = z.object({
  floors: z.array(optionSchema).refine((value) => value.some((item) => item), {
    message: "Hãy chọn ít nhất một tầng",
  }),
});

function ShowFeeInfoPage(): JSX.Element {
  const { feeInfo, rooms } = Route.useLoaderData();

  // dialog states
  const router = useRouter();
  const [isEditFeeDialogOpen, setIsEditFeeDialogOpen] = useState(false);
  const [isCollectFeeDialogOpen, setIsCollectFeeDialogOpen] = useState(false);

  // paid and unpaid households
  const [paidHouseholds, setPaidHouseholds] = useState<
    DetailedFeeInfo["fee_assignments"]
  >([]);
  const [unpaidHouseholds, setUnpaidHouseholds] = useState<
    DetailedFeeInfo["fee_assignments"]
  >([]);

  useEffect(() => {
    const [paid, unpaid] = feeInfo.fee_assignments.reduce(
      (acc, assignment) => {
        if (assignment.is_paid) {
          acc[0].push(assignment);
        } else {
          acc[1].push(assignment);
        }
        return acc;
      },
      [[], []] as [
        DetailedFeeInfo["fee_assignments"],
        DetailedFeeInfo["fee_assignments"],
      ]
    );

    setPaidHouseholds(paid);
    setUnpaidHouseholds(unpaid);
  }, [feeInfo.fee_assignments]);

  const floorOptions = Object.entries(
    rooms.reduce(
      (acc, room) => {
        const floor = Math.floor(room / 100);
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push(room);
        return acc;
      },
      {} as Record<number, number[]>
    )
  ).map(([floor, rooms]) => ({
    value: floor,
    label: `Tầng ${floor}`,
    rooms,
  }));

  const options: Option[] = rooms
    .filter(
      (room) =>
        !feeInfo.fee_assignments.some(
          (assignment) => assignment.room_number === room
        )
    )
    .map((room) => {
      return {
        value: room.toString(),
        label: `Phòng ${room}`,
      };
    });

  const editFeeForm = useForm<z.infer<typeof addFeeSchema>>({
    resolver: zodResolver(addFeeSchema),
    defaultValues: {
      name: feeInfo.name,
      amount: feeInfo.amount,
      due_date: new Date(feeInfo.due_date),
      is_required: feeInfo.is_required,
      is_recurring: !!feeInfo.recurrence_type,
      recurrence_type: feeInfo.recurrence_type || undefined,
    },
  });
  function onSubmitEditFeeForm(data: z.infer<typeof addFeeSchema>) {
    const info = {
      name: data.name,
      amount: data.amount,
      due_date: format(data.due_date, "yyyy-MM-dd'T'HH:mm:ss"),
      is_required: data.is_required,
      recurrence_type: data.is_recurring ? data.recurrence_type : null,
    };

    invoke("edit_fee_info", { id: feeInfo.id, info })
      .then(() => {
        toast({ title: "Chỉnh sửa khoản thu thành công!", duration: 2000 });
        router.invalidate();
      })
      .catch((err) => {
        toast({
          title: "Chỉnh sửa khoản thu thất bại!",
          description: err,
          variant: "destructive",
          duration: 2000,
        });
      })
      .finally(() => {
        editFeeForm.reset();
        setIsEditFeeDialogOpen(false);
      });
  }

  const collectFeeForm = useForm<z.infer<typeof collectFeeSchema>>({
    resolver: zodResolver(collectFeeSchema),
    defaultValues: {
      floors: [],
    },
  });

  function onSubmitCollectFeeForm(data: z.infer<typeof collectFeeSchema>) {
    const selectedRooms = data.floors.flatMap(
      (floor) =>
        floorOptions.find((opt) => opt.value === floor.value)?.rooms || []
    );

    const info = {
      rooms: selectedRooms,
    };

    invoke("assign_fee", { feeId: feeInfo.id, roomNumbers: info.rooms })
      .then(() => {
        toast({
          title: "Đã gửi thông báo thu phí!",
          description: "Thông báo thu phí đã được gửi thành công tới các hộ",
          duration: 2000,
        });
        collectFeeForm.reset();
        setIsCollectFeeDialogOpen(false);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Có lỗi xảy ra!",
          description: "Đã xảy ra lỗi khi gửi thông báo thu phí",
          variant: "destructive",
          duration: 2000,
        });
      });
    collectFeeForm.reset();
    setIsCollectFeeDialogOpen(false);
    router.invalidate();
  }

  return (
    <div className="w-screen pt-0 px-4 bg-gray-100">
      <Link to="/dashboard/fees">
        <Button className="flex flex-row gap-2">
          <ChevronLeftIcon size={16} />
          Quay lại
        </Button>
      </Link>

      <h1 className="text-center text-2xl font-bold">Thông tin khoản thu</h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Thông tin khoản thu</h2>
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Tên khoản thu:</label>
              <p className="text-gray-700">{feeInfo.name}</p>
            </div>
            <div>
              <label className="font-semibold">Số tiền:</label>
              <p className="text-gray-700">
                {moneyFormatter.format(feeInfo.amount)}
              </p>
            </div>
            <div>
              <label className="font-semibold">Ngày bắt đầu thu:</label>
              <p className="text-gray-700">
                {format(feeInfo.created_at, "dd/MM/yyyy")}
              </p>
            </div>
            <div>
              <label className="font-semibold">Hạn nộp:</label>
              <p className="text-gray-700">
                {format(feeInfo.due_date, "dd/MM/yyyy")}
              </p>
            </div>
            <div>
              <label className="font-semibold">Bắt buộc:</label>
              <p className="text-gray-700">
                {feeInfo.is_required ? "Có" : "Không"}
              </p>
            </div>
            <div>
              <label className="font-semibold">Loại định kỳ:</label>
              <p className="text-gray-700">
                {feeInfo.recurrence_type === "weekly"
                  ? "Hàng tuần"
                  : feeInfo.recurrence_type === "monthly"
                    ? "Hàng tháng"
                    : feeInfo.recurrence_type === "yearly"
                      ? "Hàng năm"
                      : "Không định kỳ"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Dialog open={isEditFeeDialogOpen}>
              <DialogTrigger
                onClick={() => {
                  editFeeForm.setValue("amount", feeInfo.amount);
                  setIsEditFeeDialogOpen(true);
                }}
              >
                <Button className="bg-black text-white hover:bg-gray-800">
                  Chỉnh sửa khoản thu
                </Button>
              </DialogTrigger>
              <DialogContent className="[&>button]:hidden">
                <DialogTitle>Chỉnh sửa khoản thu</DialogTitle>
                <DialogDescription>
                  Điền thông tin cần chỉnh sửa và nhấn "Chỉnh sửa" để chỉnh sửa
                  thông tin.
                </DialogDescription>
                <Form {...editFeeForm}>
                  <form
                    onSubmit={editFeeForm.handleSubmit(onSubmitEditFeeForm)}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      name="name"
                      control={editFeeForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên khoản thu</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="off" />
                          </FormControl>
                          <FormMessage>
                            {editFeeForm.formState.errors.name?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="amount"
                      control={editFeeForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số tiền</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min={0} />
                          </FormControl>
                          <FormMessage>
                            {editFeeForm.formState.errors.amount?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="due_date"
                      control={editFeeForm.control}
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
                            {editFeeForm.formState.errors.due_date?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-row gap-4 justify-start">
                      <FormField
                        name="is_required"
                        control={editFeeForm.control}
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
                              {
                                editFeeForm.formState.errors.is_required
                                  ?.message
                              }
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="is_recurring"
                        control={editFeeForm.control}
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
                              {
                                editFeeForm.formState.errors.is_recurring
                                  ?.message
                              }
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    {editFeeForm.watch("is_recurring") && (
                      <FormField
                        name="recurrence_type"
                        control={editFeeForm.control}
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
                                  <SelectItem value="yearly">
                                    Hàng năm
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage>
                              {
                                editFeeForm.formState.errors.recurrence_type
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
                      editFeeForm.handleSubmit(onSubmitEditFeeForm)();
                    }}
                    className="bg-main-palette-5 hover:bg-main-palette-6"
                  >
                    Chỉnh sửa
                  </Button>
                  <DialogClose>
                    <Button onClick={() => setIsEditFeeDialogOpen(false)}>
                      Đóng
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => setIsCollectFeeDialogOpen(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              Thu phí
            </Button>
            <Dialog
              open={isCollectFeeDialogOpen}
              onOpenChange={setIsCollectFeeDialogOpen}
            >
              <DialogContent
                className="[&>button]:hidden"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogTitle>Thu phí</DialogTitle>
                <DialogDescription>
                  Chọn các tầng cần thu phí và điền thông tin để xác nhận thông
                  báo thu phí.
                </DialogDescription>
                <Form {...collectFeeForm}>
                  <form
                    onSubmit={collectFeeForm.handleSubmit(
                      onSubmitCollectFeeForm
                    )}
                    className="flex flex-col gap-4"
                  >
                    {/* Modified: Floor Selector */}
                    <FormField
                      control={collectFeeForm.control}
                      name="floors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chọn tầng</FormLabel>
                          <FormControl>
                            <MultipleSelector
                              {...field}
                              defaultOptions={floorOptions}
                              placeholder="Chọn các tầng cần thu phí"
                              emptyIndicator="Không có tầng nào"
                            />
                          </FormControl>
                          <FormMessage>
                            {collectFeeForm.formState.errors.floors?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <DialogFooter>
                  <Button
                    onClick={() =>
                      collectFeeForm.handleSubmit(onSubmitCollectFeeForm)()
                    }
                    className="bg-main-palette-5 hover:bg-main-palette-6"
                  >
                    Thu
                  </Button>
                  <DialogClose>
                    <Button onClick={() => setIsCollectFeeDialogOpen(false)}>
                      Đóng
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Households Lists */}
        <div className="space-y-8">
          {/* Paid Households */}
          <div className="bg-gray-200 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">
              Danh sách hộ đã nộp khoản thu
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-60">
              <div className="space-y-2">
                {paidHouseholds.map((house, index) => (
                  <FeeInfoTile key={index} fee={house} isPaid={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Unpaid Households */}
          <div className="bg-gray-200 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">
              Danh sách hộ chưa nộp khoản thu
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-60">
              <div className="space-y-2">
                {unpaidHouseholds.map((house, index) => (
                  <FeeInfoTile key={index} fee={house} isPaid={false} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/fees/info/$feeId")({
  component: ShowFeeInfoPage,
  loader: async ({ params }) => {
    try {
      const feeInfo = await invoke<DetailedFeeInfo>("get_fee_info", {
        feeId: Number(params.feeId),
      });
      const rooms = await invoke<number[]>("get_rooms");

      return {
        feeInfo,
        rooms,
      };
    } catch (err) {
      console.error(err);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin khoản thu",
        variant: "destructive",
      });

      throw redirect({
        to: "/dashboard/fees",
      });
    }
  },
});
