import { isTest } from './utils';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nOptions,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

const config: I18nOptions = {
  fallbackLanguage: 'pt',
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
    watch: !isTest,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
    new HeaderResolver(['x-lang']),
  ],
  typesOutputPath: isTest
    ? undefined
    : path.join(process.cwd(), 'apps/api/src/generated/i18n.generated.ts'),
};

export const I18N = { config };
