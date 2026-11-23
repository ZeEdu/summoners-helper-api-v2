import { AcceptLanguageResolver, HeaderResolver, I18nOptions, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'

const isProduction = process.env.NODE_ENV === 'production'

const config: I18nOptions = {
  fallbackLanguage: 'pt',

  loaderOptions: {
    path: path.join(__dirname, 'i18n'),
    watch: !isProduction,
  },

  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    new HeaderResolver(['x-lang']),
    AcceptLanguageResolver,
  ],

  ...(!isProduction && {
    typesOutputPath: path.join(process.cwd(), 'apps/api/src/generated/i18n.generated.ts'),
  }),
}

export const I18N = { config }
