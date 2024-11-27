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
  title: z.string(),
  message: z.string(),
  to_user: z.string(),
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

  function onSubmit(info: z.infer<typeof sendNotificationSchema>) {
    invoke("send_notification", { info })
      .then(() => {
        toast({
          title: "Gửi thông báo thành công",
          description: "Thông báo đã được gửi",
          duration: 2000,
        });
        router.invalidate();
      })
      .catch(() => {
        toast({
          title: "Gửi thông báo thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại",
          variant: "destructive",
          duration: 2000,
        });
      });
  }

  return (
    <div className="bg-gray-100 p-4 overflow-auto">
      <Button
        className="top-4 left-4 bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 focus:ring-2 focus:ring-black"
        onClick={() => {
          setViewMode("new");
          setSelectedNotification(null);
        }}
      >
        Thông báo mới
      </Button>

      <div className="flex mt-4 gap-4 max-h-80 scroll-y">
        <div className="p-4 bg-white rounded-lg shadow-md max-h-[80vh] overflow-y-auto w-1/3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border-b pb-4 mb-4 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedNotification(notification);
                setViewMode("view");
              }}
            >
              <h2 className="font-bold text-lg">{notification.to}</h2>
              <p className="text-gray-500 truncate">{notification.title}</p>
            </div>
          ))}
        </div>

        {viewMode === "view" && selectedNotification && (
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
            <h2 className="font-bold text-xl mb-4">Chi tiết thông báo</h2>
            <p className="mb-2">
              <span className="font-medium">Từ:</span>{" "}
              {selectedNotification.from}
            </p>
            <p className="mb-2">
              <span className="font-medium">Đến:</span>{" "}
              {selectedNotification.to}
            </p>
            <p className="mb-2">
              <span className="font-medium">Tiêu đề:</span>{" "}
              {selectedNotification.title}
            </p>
            <p>
              <span className="font-medium">Nội dung:</span>
            </p>
            <p className="mt-2 bg-gray-100 p-4 rounded-lg">
              {selectedNotification.message}
            </p>
          </div>
        )}

        {viewMode === "new" && (
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
            <h2 className="font-bold text-xl mb-4">Gửi thông báo mới</h2>
            <Form {...sendNotificationForm}>
              <form
                onSubmit={sendNotificationForm.handleSubmit(onSubmit)}
                className="flex flex-col w-full"
              >
                <div className="flex flex-row w-full">
                  <FormField
                    name="to_user"
                    control={sendNotificationForm.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormLabel className="block text-sm font-medium">
                          Người nhận
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            disabled={sendNotificationForm.watch("send_all")}
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            sendNotificationForm.formState.errors.to_user
                              ?.message
                          }
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="send_all"
                    control={sendNotificationForm.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center text-sm gap-2">
                        {/* <FormLabel className="text-sm font-medium"> */}
                        Gửi tất cả
                        {/* </FormLabel> */}
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="title"
                  control={sendNotificationForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <input {...field} required />
                      </FormControl>
                      <FormMessage>
                        {sendNotificationForm.formState.errors.title?.message}
                      </FormMessage>
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
                        <textarea {...field} required />
                      </FormControl>
                      <FormMessage>
                        {sendNotificationForm.formState.errors.message?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-main-palette-4 hover:bg-main-palette-5 mt-8"
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

      return {
        notifications,
      };
    } catch {
      return {
        notifications: [],
      };
    }
  },
});
