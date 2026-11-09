import { BadRequestException, PipeTransform } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as z from 'zod';

import { zodIssueDescriptor, zodIssueDescriptorInputNormalizer } from '@org/contracts';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) { }

  transform(value: unknown) {
    const i18n = I18nContext.current()
    const result = this.schema.safeParse(value)

    if (!result.success) {
      const error = result.error.issues.map(issue => {
        // Formatar a issue
        const input = zodIssueDescriptorInputNormalizer(issue)
        const formatedZodError = zodIssueDescriptor(input)
        // Identificar a mensagem
        let localizedIssue
        if (i18n) {
          localizedIssue = i18n.t(formatedZodError.key, { args: formatedZodError.params })
        }

        return {
          path: issue.path.join('.'),
          message: localizedIssue || issue.message,
          code: issue.code
        }
      })

      throw new BadRequestException(error);
    }

    return result.data
  }
}