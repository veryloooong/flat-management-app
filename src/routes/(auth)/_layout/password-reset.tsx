import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { invoke } from '@tauri-apps/api/core'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const forgotPasswordFormSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  phone: z.string(),
  method: z.enum(['email', 'phone']),
})

function ForgotPasswordPage(): JSX.Element {
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      method: 'email',
    }
  })

  function onSubmit(data: z.infer<typeof forgotPasswordFormSchema>) {
    invoke('account_recovery', { recoveryInfo: data })
      .then((res) => console.log(res))
      .catch((err) => console.error(err))
  }

  return (
    <Fragment>
      <h1>Khôi phục mật khẩu</h1>
      <p>
        Để khôi phục mật khẩu, vui lòng nhập thông tin dưới đây. Chúng tôi sẽ
        gửi mã xác nhận qua email hoặc số điện thoại của bạn.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đăng nhập <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} maxLength={32} required />
                </FormControl>
                <FormMessage>{form.formState.errors.username?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="method"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phương thức</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} required>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Phương thức khôi phục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Số điện thoại</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage>{form.formState.errors.method?.message}</FormMessage>
              </FormItem>
            )}
          />
          {form.getValues('method') === 'email' && (
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}
          {form.getValues('method') === 'phone' && (
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="bg-main-palette-4 hover:bg-main-palette-5 mt-8">Gửi mã xác nhận</Button>
        </form>
      </Form>
    </Fragment>
  )
}

export const Route = createFileRoute('/(auth)/_layout/password-reset')({
  component: ForgotPasswordPage,
})
