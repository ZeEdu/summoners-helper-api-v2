import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nOptions,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

import { Utils } from './utils';

const config: I18nOptions = {
  fallbackLanguage: 'pt',
  loaderOptions: {
    path: path.join(__dirname, 'i18n'),
    watch: !Utils.isTest,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
    new HeaderResolver(['x-lang']),
  ],
  typesOutputPath: Utils.isTest
    ? undefined
    : path.join(process.cwd(), 'generated/i18n.generated.ts'),
};

export const I18N = { config };
