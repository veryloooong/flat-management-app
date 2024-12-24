import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { PasswordInput } from "@/components/ui/password-input";
import { ChevronLeft } from "lucide-react";

const registerFormSchema = z
  .object({
    name: z.string().min(2, "Tên không được quá ngắn").trim(),
    username: z
      .string()
      .toLowerCase()
      .max(32, "Tên đăng nhập không được dài quá 32 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Tên đăng nhập chỉ được chứa ký tự chữ cái, chữ số và dấu gạch dưới"
      )
      .refine((data) => {
        // Username must not be only numbers
        return !/^\d+$/.test(data);
      }, "Tên đăng nhập không được chỉ chứa ký tự số")
      .refine((data) => {
        // Username must not be only underscores
        return !/^_+$/.test(data);
      }, "Tên đăng nhập không được chỉ chứa dấu gạch dưới")
      .refine((data) => {
        // Username must not be reserved
        return !["admin", "root", "superuser"].includes(data);
      }, "Tên đăng nhập không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
      .refine((value) => {
        // Password must contain at least one uppercase letter
        return /[A-Z]/.test(value);
      }, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa")
      .refine((value) => {
        // Password must contain at least one lowercase letter
        return /[a-z]/.test(value);
      }, "Mật khẩu phải chứa ít nhất một chữ cái viết thường")
      .refine((value) => {
        // Password must contain at least one number
        return /[0-9]/.test(value);
      }, "Mật khẩu phải chứa ít nhất một chữ số")
      .refine((value) => {
        // Password must contain at least one special character
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
      }, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),
    confirmPassword: z.string().min(8, "Mật khẩu phải chứa ít nhất 8 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .regex(
        /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
        "Số điện thoại không hợp lệ"
      ),
    role: z.enum(["manager", "tenant"]),
    roomId: z.coerce.number().positive().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

function RegisterPage(): JSX.Element {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      role: "manager",
      roomId: 1,
    },
  });

  function onSubmit(data: z.infer<typeof registerFormSchema>) {
    invoke("account_register", {
      accountInfo: {
        name: data.name,
        username: data.username.toLowerCase(),
        password: data.password,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        room_id: data.roomId,
      },
    })
      .then((_) => {
        toast({
          title: "Đăng ký tài khoản thành công",
          description:
            "Quản trị viên sẽ xét duyệt tài khoản của bạn, vui lòng đợi trong khoảng 1-2 ngày",
          duration: 2000,
        });
      })
      .catch((err) => {
        toast({
          title: "Đăng ký tài khoản thất bại",
          description: `Có lỗi xảy ra khi đăng ký tài khoản: ${err}, vui lòng thử lại sau`,
          variant: "destructive",
          duration: 2000,
        });
      });
  }

  return (
    <Fragment>
      <Link to="..">
        <Button
          className="flex flex-row items-center content-center gap-2 px-0 w-fit"
          variant="link"
          tabIndex={-1}
        >
          <ChevronLeft size={18} />
          <p className="">Quay lại trang chính</p>
        </Button>
      </Link>

      <h1>Đăng ký tài khoản</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên đăng nhập <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} maxLength={32} required />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.username?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mật khẩu <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} required />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <p className="text-sm my-4">
            Mật khẩu được chấp nhận bao gồm:
            <ul className="list-disc list-inside">
              <li>Ít nhất 8 ký tự</li>
              <li>Ít nhất một chữ cái viết hoa</li>
              <li>Ít nhất một chữ cái viết thường</li>
              <li>Ít nhất một chữ số</li>
              <li>Ít nhất một ký tự đặc biệt</li>
            </ul>
          </p>
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} required />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.confirmPassword?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ và tên <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" {...field} required />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số điện thoại <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Loại tài khoản <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại tài khoản" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="manager">Quản lý</SelectItem>
                    <SelectItem value="tenant">Hộ dân</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage>{form.formState.errors.role?.message}</FormMessage>
              </FormItem>
            )}
          />
          {form.watch("role") === "tenant" && (
            <FormField
              name="roomId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng số</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.roomId?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="bg-main-palette-4 hover:bg-main-palette-5 mt-8"
          >
            Đăng ký
          </Button>
        </form>
      </Form>
    </Fragment>
  );
}

export const Route = createFileRoute("/(auth)/_layout/register")({
  component: RegisterPage,
});
