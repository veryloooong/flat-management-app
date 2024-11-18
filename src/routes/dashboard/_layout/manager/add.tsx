import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const addFeeSchema = z.object({
  name: z.string(),
  amount: z.number(),
  deadline: z.string(),
  required: z.boolean(),
})

function AddPage(): JSX.Element {
  const navigate = useNavigate();

  const addFeeForm = useForm<z.infer<typeof addFeeSchema>>({
    resolver: zodResolver(addFeeSchema),
    defaultValues: {
      name: '',
      amount: 0,
      deadline: '',
      required: true,
    },
  })

  function onSubmitAddFeeForm(data: z.infer<typeof addFeeSchema>) {
    console.log(data)

    toast({
      title: 'Tạo khoản thu thành công',
      description: 'Khoản thu đã được tạo thành công',
    })

    setTimeout(() => {
      navigate({
        to: "/dashboard/manager"
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Tạo khoản thu</h2>
        <Form {...addFeeForm}>
          <form onSubmit={addFeeForm.handleSubmit(onSubmitAddFeeForm)}>
            <FormField
              name="name"
              control={addFeeForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khoản thu</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{addFeeForm.formState.errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              name="amount"
              control={addFeeForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage>{addFeeForm.formState.errors.amount?.message}</FormMessage>
                </FormItem>
              )}
            />
            {/* TODO: make a date picker element here */}
            <FormField
              name="deadline"
              control={addFeeForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hạn nộp</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{addFeeForm.formState.errors.deadline?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              name="required"
              control={addFeeForm.control}
              render={({ field }) => (
                <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Có bắt buộc?</FormLabel>
                  <FormMessage>{addFeeForm.formState.errors.required?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* TODO this shit */}
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Xác nhận</button>
              <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Hủy</button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/manager/add')({
  component: AddPage,
})

export default Route;