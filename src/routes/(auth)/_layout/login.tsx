import { createFileRoute, Link } from '@tanstack/react-router'
import { Fragment } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'


const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
})

function LoginPage(): JSX.Element {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  })

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    console.log(data)
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
                <FormMessage>{form.formState.errors.username?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" {...field} required />
                </FormControl>
                <FormMessage>{form.formState.errors.password?.message}</FormMessage>
              </FormItem>
            )}
          />


          <Button type="button" className="p-0 self-end" variant="link">
            Quên mật khẩu?
          </Button>


          <Button type="submit" className="bg-main-palette-4 hover:bg-main-palette-5 mt-8">Đăng nhập</Button>
          <Link to="/register" className="w-full">
            <Button type="button" className="bg-main-palette-6 hover:bg-main-palette-7 mt-2 w-full">Đăng ký</Button>
          </Link>
        </form>
      </Form>
    </Fragment>
  )
}

export const Route = createFileRoute('/(auth)/_layout/login')({
  component: LoginPage,
})
