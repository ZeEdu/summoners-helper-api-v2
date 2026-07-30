import { Types } from "mongoose";
import z from "zod";

export const objectIdSchema = z.string().refine(
  Types.ObjectId.isValid, { error: 'ObjectId inválido' }
)