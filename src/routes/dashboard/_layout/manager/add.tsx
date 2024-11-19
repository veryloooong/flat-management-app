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
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { invoke } from '@tauri-apps/api/core';

const addFeeSchema = z.object({
  name: z.string(),
  amount: z.coerce.number().positive("Số tiền phải lớn hơn 0"),
  collected_at: z.date(),
  is_required: z.boolean(),
})

function AddPage(): JSX.Element {
  const navigate = useNavigate();

  const addFeeForm = useForm<z.infer<typeof addFeeSchema>>({
    resolver: zodResolver(addFeeSchema),
    defaultValues: {
      name: '',
      amount: 0,
      // deadline: new Date(),
      is_required: true,
    },
  })

  function onSubmitAddFeeForm(data: z.infer<typeof addFeeSchema>) {
    // console.log(data)
    let info = {
      name: data.name,
      amount: data.amount,
      collected_at: format(data.collected_at, 'yyyy-MM-dd'),
      is_required: data.is_required,
    }

    invoke('add_fee', { info }).then((_) => {
      toast({
        title: 'Tạo khoản thu thành công',
        description: 'Khoản thu đã được tạo thành công',
      })

      setTimeout(() => {
        navigate({
          to: "/dashboard/manager"
        })
      }, 2000)

    }).catch((err) => {
      console.error(err)
      toast({
        title: 'Tạo khoản thu thất bại',
        description: 'Có lỗi xảy ra khi tạo khoản thu',
        variant: 'destructive'
      })
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Tạo khoản thu</h2>
        <Form {...addFeeForm}>
          <form onSubmit={addFeeForm.handleSubmit(onSubmitAddFeeForm)} className='flex flex-col gap-4' autoComplete='off'>
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
              name="collected_at"
              control={addFeeForm.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Hạn nộp</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage>{addFeeForm.formState.errors.collected_at?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              name="is_required"
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
                  <FormMessage>{addFeeForm.formState.errors.is_required?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* TODO this shit */}
            <div className="flex justify-between">
              <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Xác nhận</Button>
              <Button type="reset" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400" onClick={() => { navigate({ to: '..' }) }}>Hủy</Button>
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