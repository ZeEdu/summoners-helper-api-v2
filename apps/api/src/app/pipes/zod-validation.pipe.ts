import { BadRequestException, PipeTransform } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as z from 'zod';

import { isValidCustomError, VALIDATION_ERROR_KEYS } from '@org/contracts';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) { }

  transform(value: unknown) {
    const i18n = I18nContext.current()
    const result = this.schema.safeParse(value)

    if (!result.success) {
      const error = result.error.issues.map(issue => {
        // Formatar a issue
        const formatedZodError = formatZodIssue(issue)
        // Identificar a mensagem
        let localizedIssue
        if (i18n) {
          localizedIssue = i18n.t(formatedZodError.key)
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

type ValidationMessageDescriptor = {
  key: string,
  params?: Record<string, unknown>
}

function formatZodIssue(issue: z.core.$ZodIssue): ValidationMessageDescriptor {
  let key: string = VALIDATION_ERROR_KEYS.default
  let params = undefined

  switch (issue.code) {
    case 'invalid_type':
      key = VALIDATION_ERROR_KEYS.type
      break
    case 'invalid_format':
      switch (issue.format) {
        case 'email':
          key = VALIDATION_ERROR_KEYS.email
          break
        case 'regex':
          if (issue.message === VALIDATION_ERROR_KEYS.passwordPattern) {
            key = VALIDATION_ERROR_KEYS.passwordPattern
          } else {
            key = VALIDATION_ERROR_KEYS.regex
          }
          break
        default:
          key = VALIDATION_ERROR_KEYS.format
          break
      }
      break
    case 'too_small':
      switch (issue.origin) {
        case 'array':
          key = VALIDATION_ERROR_KEYS.arrayMin
          params = {
            min: issue.minimum
          }
          break
        case 'number':
          key = VALIDATION_ERROR_KEYS.numberMin
          params = {
            min: issue.minimum
          }
          break
        case 'string':
        default:
          key = VALIDATION_ERROR_KEYS.stringMin
          params = {
            min: issue.minimum
          }
          break
      }
      break
    case 'too_big':
      switch (issue.origin) {
        case 'array':
          key = VALIDATION_ERROR_KEYS.arrayMax
          params = {
            min: issue.maximum
          }
          break
        case 'number':
          key = VALIDATION_ERROR_KEYS.numberMax
          params = {
            min: issue.maximum
          }
          break
        case 'string':
        default:
          key = VALIDATION_ERROR_KEYS.stringMax
          params = {
            min: issue.maximum
          }
          break
      }
      break
    case 'custom':
      key = isValidCustomError(issue.message) ? issue.message : VALIDATION_ERROR_KEYS.default
      break
    default:
      key = VALIDATION_ERROR_KEYS.default
      break
  }

  return { key, params }
}