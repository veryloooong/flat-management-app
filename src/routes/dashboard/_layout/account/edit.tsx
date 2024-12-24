import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Fragment } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import snakecaseKeys from "snakecase-keys";

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
import { PasswordInput } from "@/components/ui/password-input";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const updateUserInfoSchema = z.object({
  name: z.string().min(2, "Tên không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .regex(
      /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
      "Số điện thoại không hợp lệ"
    ),
});

const updatePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
      .refine(
        (value) => /[A-Z]/.test(value),
        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa"
      )
      .refine(
        (value) => /[a-z]/.test(value),
        "Mật khẩu phải chứa ít nhất một chữ cái viết thường"
      )
      .refine(
        (value) => /[0-9]/.test(value),
        "Mật khẩu phải chứa ít nhất một chữ số"
      )
      .refine(
        (value) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
        "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu cũ",
    path: ["newPassword"],
  });

function AccountEditPage(): JSX.Element {
  const router = useRouter();
  const userInfo = Route.useLoaderData();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const updateUserInfoForm = useForm<z.infer<typeof updateUserInfoSchema>>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
    },
  });

  const updatePasswordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmitUpdateUserInfoForm(
    data: z.infer<typeof updateUserInfoSchema>
  ) {
    invoke("update_user_info", { info: snakecaseKeys(data) })
      .then(() => {
        toast({
          title: "Cập nhật thông tin thành công",
          description: "Thông tin tài khoản của bạn đã được cập nhật",
          duration: 5000,
        });
        router.invalidate();
      })
      .catch(() => {
        toast({
          title: "Cập nhật thông tin thất bại",
          description: "Vui lòng thử lại sau",
          duration: 5000,
        });
      });
  }

  function onSubmitUpdatePasswordForm(
    data: z.infer<typeof updatePasswordSchema>
  ) {
    invoke("update_password", { passwordInfo: snakecaseKeys(data) })
      .then(() => {
        toast({
          title: "Cập nhật mật khẩu thành công",
          description:
            "Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại",
          duration: 5000,
        });

        setTimeout(() => {
          logout()
            .then(() => navigate({ to: "/login" }))
            .catch(() => navigate({ to: "/login" }));
        }, 5000);
      })
      .catch(() => {
        toast({
          title: "Cập nhật mật khẩu thất bại",
          description: "Vui lòng thử lại sau",
          duration: 5000,
        });
      });
  }

  return (
    <Fragment>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Update User Info Section */}
          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Cập nhật thông tin tài khoản
            </h2>
            <Form {...updateUserInfoForm}>
              <form
                onSubmit={updateUserInfoForm.handleSubmit(
                  onSubmitUpdateUserInfoForm
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <FormField
                    name="name"
                    control={updateUserInfoForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Họ và tên <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập họ và tên"
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage>
                          {updateUserInfoForm.formState.errors.name?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  {/* Email */}
                  <FormField
                    name="email"
                    control={updateUserInfoForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Địa chỉ email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập địa chỉ email"
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage>
                          {updateUserInfoForm.formState.errors.email?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  {/* Phone */}
                  <FormField
                    name="phone"
                    control={updateUserInfoForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Số điện thoại <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập số điện thoại"
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage>
                          {updateUserInfoForm.formState.errors.phone?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Cập nhật
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Thay đổi mật khẩu
            </h2>
            <Form {...updatePasswordForm}>
              <form
                onSubmit={updatePasswordForm.handleSubmit(
                  onSubmitUpdatePasswordForm
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Old Password */}
                  <FormField
                    name="oldPassword"
                    control={updatePasswordForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Mật khẩu cũ <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            placeholder="Nhập mật khẩu cũ"
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            updatePasswordForm.formState.errors.oldPassword
                              ?.message
                          }
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  {/* New Password */}
                  <FormField
                    name="newPassword"
                    control={updatePasswordForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Mật khẩu mới <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            placeholder="Nhập mật khẩu mới"
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            updatePasswordForm.formState.errors.newPassword
                              ?.message
                          }
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  {/* Confirm Password */}
                  <FormField
                    name="confirmPassword"
                    control={updatePasswordForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Xác nhận mật khẩu{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            placeholder="Xác nhận mật khẩu mới"
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            updatePasswordForm.formState.errors.confirmPassword
                              ?.message
                          }
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Thay đổi mật khẩu
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export const Route = createFileRoute("/dashboard/_layout/account/edit")({
  component: AccountEditPage,
  loader: async ({ context }) => {
    const userInfo = await context.authentication.getUserInfo();
    if (!userInfo) throw redirect({ to: "/login" });
    return userInfo;
  },
});
