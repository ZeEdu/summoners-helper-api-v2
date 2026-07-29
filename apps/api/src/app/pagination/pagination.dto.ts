import * as z from 'zod';

export const paginationSchema = z.object({
  limit: z.number({ error: 'Valor deve ser um número' }).nonnegative({ error: 'Valor deve ser positivo' }).optional(),
  offset: z.number({ error: 'Valor deve ser um número' }).nonnegative({ error: 'Valor deve ser positivo' }).optional()
})

export type PaginationDto = z.infer<typeof paginationSchema>

export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;
