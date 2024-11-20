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
    // invoke('account_login', data)
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
      .catch((_) => {
        // handle login error
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
      <h1>Đăng nhập</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
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
                  <Link to="/password-reset">
                    <Button
                      type="button"
                      className="p-0 text-main-palette-5"
                      variant="link"
                      tabIndex={-1}
                    >
                      Quên mật khẩu?
                    </Button>
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} required />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-main-palette-4 hover:bg-main-palette-5 mt-8"
          >
            Đăng nhập
          </Button>
          <Link to="/register" className="w-full">
            <Button
              type="button"
              className="bg-main-palette-6 hover:bg-main-palette-7 mt-2 w-full"
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
