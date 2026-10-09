import { BadRequestException, PipeTransform } from '@nestjs/common';
import * as z from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) { }

  transform(value: unknown) {
    const result = this.schema.safeParse(value)
    if (!result.success) {
      const error = result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      }))

      throw new BadRequestException(error);
    }

    return result.data
  }
}