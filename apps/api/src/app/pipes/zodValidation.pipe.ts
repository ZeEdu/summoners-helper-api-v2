import { BadRequestException, PipeTransform } from "@nestjs/common";
import * as z from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) { }

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Validation Failed')
    }
  }
}