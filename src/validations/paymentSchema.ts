import { z } from "zod";
import { PaymentMode } from "../enums/paymentMode";

export const createPaymentSchema = z.object({
  donorId: z.string().min(1),
  projectSubscriptionId: z.coerce.number().int().positive(),
  paymentDate: z.string().refine(
    val => !isNaN(Date.parse(val)),
    { message: "Invalid payment date format" }
  ),
  amount: z.coerce.number().positive(),
  mode: z.nativeEnum(PaymentMode),
  transactionId: z.string().min(1),
  donationScript: z.string().optional()
});


export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>;
