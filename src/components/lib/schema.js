import { z } from "zod";

export const retirementSchema = z.object({
  acneed: z.coerce.number().positive(),
  i: z.coerce.number().min(0).max(100),
  f: z.coerce.number().min(0).max(100),
  w_t: z.coerce.number().positive(),
  r_t: z.coerce.number().positive(),
});

export const riskSchema = z.object({
  a: z.coerce.number().min(0).max(20),
  u: z.coerce.number().min(0).max(100),
  r_f: z.coerce.number().min(0).max(100),
  t: z.coerce.number().positive(),
  mu: z.coerce.number().min(0).max(100),
  sigma: z.coerce.number().min(0).max(100),
  init_amount: z.coerce.number().positive(),
});
