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
  email: 'validation.email',
  regex: 'validation.regex',

  format: 'validation.format',
  default: 'validation.default'
} as const


export function isValidCustomError(message: string) {
  const validationValuesSet: Set<string> = new Set(Object.values(VALIDATION_ERROR_KEYS))
  return validationValuesSet.has(message)
}