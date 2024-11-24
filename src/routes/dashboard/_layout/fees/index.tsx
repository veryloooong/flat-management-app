import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { feeColumns } from "@/lib/columns";
import { BasicFeeInfo } from "@/lib/types";
import { createFileRoute, useRouter } from "@tanstack/react-router";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

function FeesPage(): JSX.Element {
  const fees = Route.useLoaderData();
  const router = useRouter();
  const [isAddFeeDialogOpen, setIsAddFeeDialogOpen] = useState(false);

  const addFeeForm = useForm<z.infer<typeof addFeeSchema>>({
    resolver: zodResolver(addFeeSchema),
    defaultValues: {
      name: "",
      amount: 0,
      due_date: add(new Date(), { months: 1 }),
      is_required: true,
    },
  });

  function onSubmitAddFeeForm(data: z.infer<typeof addFeeSchema>) {
    let info = {
      name: data.name,
      amount: data.amount,
      due_date: format(data.due_date, "yyyy-MM-dd'T'HH:mm:ss"),
      is_required: data.is_required,
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
        {/* <Link to="/dashboard/manager/add">
          <Button>Thêm khoản thu</Button>
        </Link> */}
        <Dialog open={isAddFeeDialogOpen}>
          <DialogTrigger
            onClick={() => {
              setIsAddFeeDialogOpen(true);
            }}
          >
            <Button>Thêm khoản thu</Button>
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
                          <PopoverContent className="w-auto p-0" align="start">
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
              <DialogClose>
                <Button onClick={() => setIsAddFeeDialogOpen(false)}>
                  Đóng
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
