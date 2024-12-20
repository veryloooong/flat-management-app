import { z } from "zod";

export const addFeeSchema = z.object({
  name: z.string(),
  amount: z.coerce.number().positive("Số tiền phải lớn hơn 0"),
  due_date: z.date(),
  is_required: z.boolean(),
  is_recurring: z.boolean(),
  recurrence_type: z.enum(["weekly", "monthly", "yearly"]).optional(),
});
