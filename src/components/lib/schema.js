import { z } from "zod";

export const riskSchema = z.object({
  r_f: z.coerce.number().positive().min(0).max(100),
  t: z.coerce.number().positive(),
  mu: z.coerce.number().positive().min(0).max(100),
  sigma: z.coerce.number().positive().min(0).max(100),
  init_amount: z.coerce.number().positive(),
  start_year: z.coerce
    .number({
      required_error: "Start of plan is required", // Custom error message if the field is missing
      invalid_type_error: "Start of plan must be a number", // Custom error message if the type is wrong
    })
    .int(),
  end_year: z.coerce
    .number({
      required_error: "End of plan is required", // Custom error message if the field is missing
      invalid_type_error: "End of plan must be a number", // Custom error message if the type is wrong
    })
    .int(),
});
