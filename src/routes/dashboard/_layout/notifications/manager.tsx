import { Button } from "@/components/ui/button";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Notification } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const sendNotificationSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  message: z.string().min(1, "Nội dung không được để trống"),
  to_user: z.string().optional(),
  send_all: z.boolean(),
});

function NotifyPage(): JSX.Element {
  const router = useRouter();
  const { notifications } = Route.useLoaderData();
  const [viewMode, setViewMode] = useState<"new" | "view" | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const sendNotificationForm = useForm<z.infer<typeof sendNotificationSchema>>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      to_user: "",
      send_all: false,
    },
  });

  const handleNotificationSubmit = async (info: z.infer<typeof sendNotificationSchema>) => {
    try {
      await invoke("send_notification", { info });
      toast({
        title: "Thông báo đã được gửi thành công!",
        description: "Người nhận sẽ nhận được thông báo ngay.",
        duration: 2000,
      });
      router.invalidate();
    } catch {
      toast({
        title: "Gửi thông báo thất bại!",
        description: "Vui lòng kiểm tra lại thông tin và thử lại.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="bg-gray-100 p-6 overflow-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý thông báo</h1>
        <Button
          onClick={() => {
            setViewMode("new");
            setSelectedNotification(null);
          }}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Tạo Thông Báo Mới
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Notifications List */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
          <h2 className="font-semibold text-xl mb-4">Danh sách thông báo</h2>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="border-b pb-4 mb-4 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedNotification(notification);
                  setViewMode("view");
                }}
              >
                <h3 className="font-bold text-lg">{notification.to}</h3>
                <p className="text-gray-500 truncate">{notification.title}</p>
                <p className="text-gray-500 truncate">{notification.created_at.substring(0, 10)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có thông báo nào.</p>
          )}
        </div>

        {/* Notification Details */}
        {viewMode === "view" && selectedNotification && (
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Chi tiết thông báo</h2>
            <div className="space-y-4">
              <p>
                <span className="font-medium">Từ:</span> {selectedNotification.from}
              </p>
              <p>
                <span className="font-medium">Đến:</span> {selectedNotification.to}
              </p>
              <p>
                <span className="font-medium">Tiêu đề:</span> {selectedNotification.title}
              </p>
              <div>
                <span className="font-medium">Nội dung:</span>
                <p className="mt-2 bg-gray-100 p-4 rounded-lg">
                  {selectedNotification.message}
                </p>
              </div>
              <p>
                <span className="font-medium">Thời gian:</span> {selectedNotification.created_at.substring(0,10)}
              </p>
            </div>
          </div>
        )}

        {/* Create New Notification Form */}
        {viewMode === "new" && (
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Gửi thông báo mới</h2>
            <Form {...sendNotificationForm}>
              <form
                onSubmit={sendNotificationForm.handleSubmit(handleNotificationSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="to_user"
                  control={sendNotificationForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người nhận</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nhập tên người nhận"
                          disabled={sendNotificationForm.watch("send_all")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="send_all"
                  control={sendNotificationForm.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Gửi tất cả</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="title"
                  control={sendNotificationForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tiêu đề thông báo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="message"
                  control={sendNotificationForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="w-full border rounded-md p-2"
                          placeholder="Nhập nội dung thông báo"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  Gửi thông báo
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute(
  "/dashboard/_layout/notifications/manager"
)({
  component: NotifyPage,
  loader: async () => {
    try {
      const notifications = await invoke<Notification[]>("get_notifications");
      return { notifications };
    } catch {
      return { notifications: [] };
    }
  },
});
