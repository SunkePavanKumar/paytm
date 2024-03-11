import { z } from "zod";

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().optional(),
});

export default updateUserSchema;
