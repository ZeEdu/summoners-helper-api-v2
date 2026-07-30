import { BadRequestException, PipeTransform } from '@nestjs/common';
import * as z from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) { }

  transform(value: unknown) {
    const result = this.schema.safeParse(value)
    if (!result.success) {
      throw new BadRequestException(
        result.error.issues.map(issue => issue.message)
      );
    }

    return result.data
  }
}