import { Types } from "mongoose";
import z from "zod";

import { VALIDATION_ERROR_KEYS } from "@org/contracts";

export const objectIdSchema = z
  .string()
  .refine(Types.ObjectId.isValid, { params: { validation: VALIDATION_ERROR_KEYS.objectId } })