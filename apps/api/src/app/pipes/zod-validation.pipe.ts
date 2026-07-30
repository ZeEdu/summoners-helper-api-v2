import { BadRequestException, PipeTransform } from '@nestjs/common';
import * as z from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) { }

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error: any) {
      const errorMessage =
        JSON.parse(error.message)?.[0]?.message || 'Validation Failed';
      throw new BadRequestException(errorMessage);
    }
  }
}