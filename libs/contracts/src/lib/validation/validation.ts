
export const VALIDATION_ERROR_KEYS = {
  enum: 'validation.enum',
  reportTargetRequired: 'validation.reportTargetRequired',
  passwordPattern: 'validation.passwordPattern',
  objectId: 'validation.objectId',
  type: 'validation.type',
  stringMin: 'validation.string.min',
  stringMax: 'validation.string.max',
  numberMin: 'validation.number.min',
  numberMax: 'validation.number.max',
  arrayMin: 'validation.array.min',
  arrayMax: 'validation.array.max',
  invalid: 'validation.invalid',
  email: 'validation.email',
  regex: 'validation.regex',
  format: 'validation.format',
  default: 'validation.default'
} as const

export function isValidCustomError(message: string) {
  const validationValuesSet: Set<string> = new Set(Object.values(VALIDATION_ERROR_KEYS))
  return validationValuesSet.has(message)
}

type ValidationMessageDescriptor = {
  key: string,
  params?: Record<string, unknown>
}


type ZodIssueDescriptorInputType = {
  code: string,
  format: string,
  message: string,
  origin: string,
  minimum?: number,
  maximum?: number,
  path: PropertyKey[]
  params: Record<string, any>
}

export function zodIssueDescriptorInputNormalizer(issue: Record<string, any>): ZodIssueDescriptorInputType {
  return {
    code: issue['code'],
    format: issue['format'],
    message: issue['message'],
    origin: issue['origin'],
    minimum: issue['minimum'],
    maximum: issue['maximum'],
    path: issue['path'],
    params: issue['params']
  }
}

export function zodIssueDescriptor(issue: ZodIssueDescriptorInputType): ValidationMessageDescriptor {
  let key: string = VALIDATION_ERROR_KEYS.default
  let params = undefined

  const isPassword = issue.path.find((p) => p === 'password')
  const isCustomError = issue.params?.['validation'] && isValidCustomError(issue.params['validation'])

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
          if (isPassword) {
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
          if (issue.minimum) {
            params = {
              minimum: issue.minimum
            }
          }
          break
        case 'number':
          key = VALIDATION_ERROR_KEYS.numberMin
          if (issue.minimum) {
            params = {
              minimum: issue.minimum
            }
          }
          break
        case 'string':
        default:
          key = VALIDATION_ERROR_KEYS.stringMin
          if (issue.minimum) {
            params = {
              minimum: issue.minimum
            }
          }
          break
      }
      break
    case 'too_big':
      switch (issue.origin) {
        case 'array':
          key = VALIDATION_ERROR_KEYS.arrayMax
          if (issue.maximum) {
            params = {
              maximum: issue.maximum
            }
          }
          break
        case 'number':
          key = VALIDATION_ERROR_KEYS.numberMax
          if (issue.maximum) {
            params = {
              maximum: issue.maximum
            }
          }
          break
        case 'string':
        default:
          key = VALIDATION_ERROR_KEYS.stringMax
          if (issue.maximum) {
            params = {
              maximum: issue.maximum
            }
          }
          break
      }
      break
    // Currently, `invalid_value` is only used by z.enum() in our schemas.
    // Revisit this assumption if z.literal() or other schemas using this issue code are introduced.
    case 'invalid_value':
      key = VALIDATION_ERROR_KEYS.invalid
      break
    case 'custom':
      key = isCustomError ? issue.params['validation'] : VALIDATION_ERROR_KEYS.default
      break
    default:
      key = VALIDATION_ERROR_KEYS.default
      break
  }

  return { key, params }
}