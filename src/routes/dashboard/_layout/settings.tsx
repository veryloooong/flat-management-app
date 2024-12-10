import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "@/hooks/use-toast";
import { TOAST_TIMEOUT } from "@/lib/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

const settingsSchema = z.object({
  server_url: z.string(),
});

function SettingsPage(): JSX.Element {
  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      server_url: "http://localhost:8080/",
    },
  });

  function onSubmit(data: z.infer<typeof settingsSchema>) {
    invoke("update_settings", { data })
      .then((_) => {
        toast({
          title: "Cập nhật thông tin thành công",
          duration: TOAST_TIMEOUT,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Cập nhật thông tin thất bại",
          duration: TOAST_TIMEOUT,
          variant: "destructive",
        });
      });
  }

  return (
    <div className="flex flex-col w-screen items-center">
      <h1>Cài đặt nâng cao</h1>
      <p className="text-red-400">
        Tuyệt đối không thay đổi cài đặt trừ khi được hướng dẫn cụ thể!
      </p>
      <div className="w-3/5">
        <Form {...settingsForm}>
          <form
            onSubmit={settingsForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="server_url"
              control={settingsForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đường dẫn tới server</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage>
                    {settingsForm.formState.errors.server_url?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button className="self-end">Cập nhật</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/settings")({
  component: SettingsPage,
});
