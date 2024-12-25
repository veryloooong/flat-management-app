import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { ChevronLeft } from "lucide-react";

const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function LoginPage(): JSX.Element {
  const { toast } = useToast();
  const navigate = useNavigate();
  const LOGIN_NAVIGATE_DELAY = 2000;
  const { login } = useAuth();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    login(data)
      .then((_) => {
        toast({
          title: "Đăng nhập thành công",
          description: "Bạn sẽ được chuyển hướng tới trang chính",
          duration: LOGIN_NAVIGATE_DELAY,
        });
        setTimeout(() => {
          navigate({
            to: "/dashboard",
          });
        }, LOGIN_NAVIGATE_DELAY);
      })
      .catch((err) => {
        // handle login error
        if ((err as string) === "unactivated") {
          toast({
            title: "Tài khoản chưa được kích hoạt",
            description:
              "Vui lòng chờ đợi kích hoạt tài khoản hoặc liên hệ với quản trị viên",
            duration: 5000,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Đăng nhập thất bại",
          description:
            "Vui lòng kiểm tra lại thông tin đăng nhập hoặc thử lại sau",
          duration: 5000,
          variant: "destructive",
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

      <h1>Đăng nhập</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đăng nhập</FormLabel>
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
                <FormLabel className="flex flex-row justify-between items-center w-full">
                  <p>Mật khẩu</p>
                  {/* <Link to="/password-reset">
                    <Button
                      type="button"
                      className="p-0 text-main-palette-5"
                      variant="link"
                      tabIndex={-1}
                    >
                      Quên mật khẩu?
                    </Button>
                  </Link> */}
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

          <Button
            type="submit"
            className="bg-main-palette-4 hover:bg-main-palette-5 mt-4"
          >
            Đăng nhập
          </Button>
          <Link to="/register" className="w-full">
            <Button
              type="button"
              className="bg-main-palette-6 hover:bg-main-palette-7 w-full"
              tabIndex={-1}
            >
              Đăng ký
            </Button>
          </Link>
        </form>
      </Form>
    </Fragment>
  );
}

export const Route = createFileRoute("/(auth)/_layout/login")({
  component: LoginPage,
});
