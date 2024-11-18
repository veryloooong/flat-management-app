import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Fragment } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import snakecaseKeys from 'snakecase-keys'

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
import { PasswordInput } from '@/components/ui/password-input'
import { invoke } from '@tauri-apps/api/core'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth'

const updateUserInfoSchema = z
  .object({
    name: z.string().min(2, 'Tên không hợp lệ'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string(),
  })

const updatePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string()
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
  })

  const updatePasswordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  })

  function onSubmitUpdateUserInfoForm(data: z.infer<typeof updateUserInfoSchema>) {
    invoke('update_user_info', { info: snakecaseKeys(data) })
      .then((_) => {
        toast({
          title: 'Cập nhật thông tin thành công',
          description: 'Thông tin tài khoản của bạn đã được cập nhật',
          duration: 5000,
        })
      })
      .catch((_) => {
        toast({
          title: 'Cập nhật thông tin thất bại',
          description: 'Vui lòng thử lại sau',
          duration: 5000,
        })
      })
  }

  function onSubmitUpdatePasswordForm(data: z.infer<typeof updatePasswordSchema>) {
    invoke('update_password', { passwordInfo: snakecaseKeys(data) })
      .then((_) => {
        toast({
          title: 'Cập nhật mật khẩu thành công',
          description: 'Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại',
          duration: 5000,
        })

        setTimeout(() => {
          logout()
            .then(() => {
              navigate({
                to: '/login',
              })
            })
            .catch((_) => {
              navigate({
                to: '/login',
              })
            })
        }, 5000)
      })
      .catch((_) => {
        toast({
          title: 'Cập nhật mật khẩu thất bại',
          description: 'Vui lòng thử lại sau',
          duration: 5000,
        })
      })
  }

  return (
    <Fragment>
      <h1 className='flex justify-center items-center mt-10 text-main-palette-5'>Thay đổi thông tin tài khoản</h1>
      <div className="flex justify-center items-center">
        <div className="max-w-4xl w-full m-5 p-1">
          <Form {...updateUserInfoForm}>
            <form onSubmit={updateUserInfoForm.handleSubmit(onSubmitUpdateUserInfoForm)} className="flex flex-col m-12 text-main-palette-6">
              <h3 className="flex justify-center text-3xl">Tài khoản cá nhân</h3>
              {/* Account Information Section */}
              <div className="border-b pb-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="name"
                    control={updateUserInfoForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập họ và tên" required />
                        </FormControl>
                        <FormMessage>{updateUserInfoForm.formState.errors.name?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    control={updateUserInfoForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="nhập địa chỉ email" required />
                        </FormControl>
                        <FormMessage>{updateUserInfoForm.formState.errors.email?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="phone"
                    control={updateUserInfoForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage>
                          {updateUserInfoForm.formState.errors.phone?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Cập nhật thông tin
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          {/* Password Update Section */}

          <Form {...updatePasswordForm}>
            <form onSubmit={updatePasswordForm.handleSubmit(onSubmitUpdatePasswordForm)} className="flex flex-col m-12 text-main-palette-6">
              <h3 className="flex justify-center text-3xl">Thay đổi mật khẩu</h3>
              <div className="border-b pb-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="oldPassword"
                    control={updatePasswordForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu cũ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <PasswordInput {...field} required />
                        </FormControl>
                        <FormMessage>{updatePasswordForm.formState.errors.oldPassword?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="newPassword"
                    control={updatePasswordForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <PasswordInput {...field} required />
                        </FormControl>
                        <FormMessage>{updatePasswordForm.formState.errors.newPassword?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="confirmPassword"
                    control={updatePasswordForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <PasswordInput {...field} required />
                        </FormControl>
                        <FormMessage>{updatePasswordForm.formState.errors.confirmPassword?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Fragment>


  )
}

export const Route = createFileRoute('/dashboard/_layout/account/edit')({
  component: AccountEditPage,
  loader: async ({ context }) => {
    const userInfo = await context.authentication.getUserInfo();

    if (!userInfo) {
      throw redirect({
        to: '/login'
      })
    }

    return userInfo;
  }
})
