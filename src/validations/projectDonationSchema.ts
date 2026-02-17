import * as z from "zod";
import { PaymentMode } from "../enums/paymentMode";

export const createProjectDonationSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  donorName: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentMode: z.nativeEnum(PaymentMode),
  transactionId: z.string().optional(),
  otp: z.string().length(6, "OTP must be 6 digits")
})
.refine(
  data => data.paymentMode !== "online" || !!data.transactionId,
  {
    message: "Transaction ID required for online payments",
    path: ["transactionId"]
  }
);


export type CreateProjectDonationDTO = z.infer<typeof createProjectDonationSchema>;
