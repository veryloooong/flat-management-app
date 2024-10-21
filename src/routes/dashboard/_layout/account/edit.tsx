import { createFileRoute } from '@tanstack/react-router'
import { Fragment, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
  SelectValue,
} from '@/components/ui/select'
import { PasswordInput } from '@/components/ui/password-input'

const registerFormSchema = z
  .object({
    username: z
      .string()
      .toLowerCase()
      .max(32, 'Tên đăng nhập không được dài quá 32 ký tự')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Tên đăng nhập chỉ được chứa ký tự chữ cái, chữ số và dấu gạch dưới',
      )
      .refine((data) => {
        // Username must not be only numbers
        return !/^\d+$/.test(data)
      }, 'Tên đăng nhập không được chỉ chứa ký tự số')
      .refine((data) => {
        // Username must not be only underscores
        return !/^_+$/.test(data)
      }, 'Tên đăng nhập không được chỉ chứa dấu gạch dưới')
      .refine((data) => {
        // Username must not be reserved
        return !['admin', 'root', 'superuser'].includes(data)
      }, 'Tên đăng nhập không hợp lệ'),
    oldPassword: z
      .string()
      .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự')
      .refine((value) => {
        // Password must contain at least one uppercase letter
        return /[A-Z]/.test(value)
      }, 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa')
      .refine((value) => {
        // Password must contain at least one lowercase letter
        return /[a-z]/.test(value)
      }, 'Mật khẩu phải chứa ít nhất một chữ cái viết thường')
      .refine((value) => {
        // Password must contain at least one number
        return /[0-9]/.test(value)
      }, 'Mật khẩu phải chứa ít nhất một chữ số')
      .refine((value) => {
        // Password must contain at least one special character
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
      }, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự')
      .refine((value) => {
        // Password must contain at least one uppercase letter
        return /[A-Z]/.test(value)
      }, 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa')
      .refine((value) => {
        // Password must contain at least one lowercase letter
        return /[a-z]/.test(value)
      }, 'Mật khẩu phải chứa ít nhất một chữ cái viết thường')
      .refine((value) => {
        // Password must contain at least one number
        return /[0-9]/.test(value)
      }, 'Mật khẩu phải chứa ít nhất một chữ số')
      .refine((value) => {
        // Password must contain at least one special character
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
      }, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt'),
    confirmPassword: z.string().min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string(),
    type: z.enum(['manager', 'tenant']),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
  .refine((data) => data.oldPassword !== data.confirmPassword, {
    message: 'Mật khẩu mới không được trùng với mật khẩu cũ',
    path: ['newPassword'],
  })

function AccountEditPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      oldPassword: '',
      confirmPassword: '',
      email: '',
      phone: '',
      type: 'manager',
    },
  })

  function onSubmit(data: z.infer<typeof registerFormSchema>) {
    console.log(data)
  }

  return (
    <Fragment>
      <h1 className='flex justify-center items-center font-sans mt-10 text-indigo-600'>Thay đổi thông tin tài khoản</h1>
      <div className="flex justify-center items-center">
        <div className=" max-w-4xl w-full m-5 p-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col m-12 text-main-palette-6">
              <p className = "flex justify-center font-mono text-3xl">Tài khoản cá nhân</p>
              {/* Account Information Section */}
              <div className="border-b pb-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập họ và tên" required />
                        </FormControl>
                        <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="nhập địa chỉ email" required />
                        </FormControl>
                        <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

<FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại <span className='text-red-500'>*</span></FormLabel>
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
                name="type"
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
                    <FormMessage>{form.formState.errors.type?.message}</FormMessage>
                  </FormItem>
                )}
              />

                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Cập nhật
                  </Button>
                </div>
              </div>

              {/* Password Update Section */}
              <p className = "flex justify-center font-mono text-3xl">Mật khẩu</p>
                <FormField
                  name="oldPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mật khẩu cũ <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput {...field} required />
                      </FormControl>
                      <FormMessage>{form.formState.errors.oldPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="newPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mật khẩu mới <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput {...field} required />
                      </FormControl>
                      <FormMessage>{form.formState.errors.newPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />
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
                      <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />
          

              <Button
                type="submit"
                className="bg-blue-500 hover:bg-main-palette-5 mt-8 text-indigo-50"
              >
                Cập nhật mật khẩu
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Fragment>


  )
}

export const Route = createFileRoute('/dashboard/_layout/account/edit')({
  component: AccountEditPage,
})
