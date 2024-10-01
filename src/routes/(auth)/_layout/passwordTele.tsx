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
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { z } from 'zod'

const recoverPasswordSchema = z.object({
  username: z.string(),
  email: z.string(),
  teleNumber: z.string(),
  type: z.enum(['email', 'telephone']),
})

function ForgotPasswordPage(): JSX.Element {
  const form = useForm<z.infer<typeof recoverPasswordSchema>>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      username: '',
      email: '',
      teleNumber: '',
      type: 'telephone',
    },
  })

  function onSubmit(data: z.infer<typeof recoverPasswordSchema>) {
    console.log(data)
  }
  return (
    <Fragment>
      <h1>Khôi phục mật khẩu</h1>
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
            name="teleNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={32} required />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.username?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-main-palette-4 hover:bg-main-palette-5 mt-8"
          >
            Xác nhận
          </Button>
          <Link to="/passchange" className="w-full">
            <Button type="button" className="bg-main-palette-6 hover:bg-main-palette-7 mt-2 w-full">Quay lại</Button>
          </Link>
        </form>
      </Form>
    </Fragment>
  )
}

export const Route = createFileRoute('/(auth)/_layout/passwordTele')({
  component: ForgotPasswordPage,
})
