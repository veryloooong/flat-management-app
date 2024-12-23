import { z } from "zod";

export const addFeeSchema = z.object({
  name: z.string().nonempty("Tên khoản thu không được để trống"),
  amount: z.coerce.number().positive("Số tiền phải lớn hơn 0"),
  due_date: z.date(),
  is_required: z.boolean(),
  is_recurring: z.boolean(),
  recurrence_type: z.enum(["weekly", "monthly", "yearly"]).optional(),
});
