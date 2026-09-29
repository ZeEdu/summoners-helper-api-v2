import * as z from 'zod';

z.object({
  limit: z.preprocess(Number, z.number().nonnegative()),
});

const limitSchema = z
  .number({ error: 'Valor deve ser um número' })
  .nonnegative({ error: 'Valor deve ser positivo' })
  .optional();

const offsetSchema = z
  .number({ error: 'Valor deve ser um número' })
  .nonnegative({ error: 'Valor deve ser positivo' })
  .optional();

const sortEnum = z.enum(['desc', 'asc', ''])

const sortSchema = z
  .record(z.string(), sortEnum)
  .optional()

export const paginationSchema = z.object({
  limit: z.preprocess(Number, limitSchema),
  offset: z.preprocess(Number, offsetSchema),
  sort: sortSchema
});

export type PaginationDto = z.infer<typeof paginationSchema>;

export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;

export function sortBuilder(sort: PaginationDto['sort']) {
  if (!sort) {
    return null
  }

  const sortString: string[] = []

  Object
    .keys(sort)
    .forEach((key) => {
      const sortValue = sort[key]
      if (sortValue === 'desc') {
        sortString.push(`${1}${key}`)
      }

      if (sortValue === 'asc') {
        sortString.push(`${-1}${key}`)
      }
    })

  if (sortString.length === 0) {
    return null
  }

  return sortString.join(' ')
}
