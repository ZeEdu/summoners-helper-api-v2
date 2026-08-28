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

export const paginationSchema = z.object({
  limit: z.preprocess(Number, limitSchema),
  offset: z.preprocess(Number, offsetSchema),
});

export type PaginationDto = z.infer<typeof paginationSchema>;

export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;
