import { z } from "zod";

export const riskSchema = z.object({
  a: z.coerce.number().min(0).max(20),
  u: z.coerce.number().min(0).max(100),
  r_f: z.coerce.number().min(0).max(100),
  t: z.coerce.number().positive(),
  mu: z.coerce.number().min(0).max(100),
  sigma: z.coerce.number().min(0).max(100),
  init_amount: z.coerce.number().positive(),
});
