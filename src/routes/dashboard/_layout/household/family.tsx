import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { familyColumns } from "@/lib/columns";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { FamilyInfo } from "@/lib/types";

const addMemberSchema = z.object({
  name: z
    .string({
      message: "Tên không được để trống",
    })
    .min(1, "Tên không được để trống"),
  birthday: z.date(),
});

function FamilyManagementPage(): JSX.Element {
  const router = useRouter();
  const { familyData } = Route.useLoaderData();
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const addMemberForm = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
  });

  function onSubmitAddMemberForm(data: z.infer<typeof addMemberSchema>) {
    console.log(data);

    invoke("add_family_member", {
      memberInfo: {
        name: data.name,
        birthday: format(data.birthday, "yyyy-MM-dd"),
      },
    })
      .then((_) => {
        toast({
          title: "Thêm thành viên thành công",
          duration: 2000,
        });
        addMemberForm.reset();
        router.invalidate();
        setIsAddMemberDialogOpen(false);
      })
      .catch((err) => {
        toast({
          title: "Thêm thành viên thất bại",
          description: err as string,
          duration: 2000,
        });
      });
  }

  return (
    <div>
      <h1 className="text-center">Các thành viên gia đình</h1>
      <div className="w-4/5 mx-auto mt-8">
        <DataTable
          columns={familyColumns}
          data={familyData}
          className="bg-white"
        />
        <Dialog open={isAddMemberDialogOpen}>
          <DialogTrigger
            onClick={() => {
              setIsAddMemberDialogOpen(true);
            }}
          >
            <Button className="bg-main-palette-5 hover:bg-main-palette-6 text-white p-2 rounded">
              Thêm thành viên
            </Button>
          </DialogTrigger>
          <DialogContent className="[&>button]:hidden">
            <DialogTitle>Thêm thành viên hộ gia đình</DialogTitle>

            <Form {...addMemberForm}>
              <form
                onSubmit={addMemberForm.handleSubmit(onSubmitAddMemberForm)}
                className="flex flex-col gap-4"
              >
                <FormField
                  name="name"
                  control={addMemberForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage>
                        {addMemberForm.formState.errors.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="birthday"
                  control={addMemberForm.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Ngày sinh</FormLabel>
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
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <DialogFooter>
              <Button
                onClick={() => {
                  addMemberForm.handleSubmit(onSubmitAddMemberForm)();
                }}
                className="bg-main-palette-5 hover:bg-main-palette-6"
              >
                Thêm
              </Button>
              <Button onClick={() => setIsAddMemberDialogOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/household/family")({
  component: FamilyManagementPage,
  loader: async () => {
    try {
      let familyData = await invoke<FamilyInfo[]>("get_family_members");
      return { familyData };
    } catch (err) {
      console.error(err);
      toast({
        title: "Lỗi khi tải dữ liệu",
        description: `Có lỗi xảy ra khi tải dữ liệu: ${err}`,
        duration: 2000,
        variant: "destructive",
      });

      throw redirect({ to: "/dashboard" });
    }
  },
});
