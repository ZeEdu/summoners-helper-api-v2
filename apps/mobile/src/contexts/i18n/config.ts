import { getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import { I18n } from 'i18n-js';

import Utils from '../../utils/utils';
import en from './locales/en';
import ptBR from './locales/pt-BR';

const translations = {
  'pt': ptBR,
  en
}

const i18n = new I18n(translations)

const savedLang = Utils.isWeb ? localStorage.getItem('lang') : SecureStore.getItem('lang')

if (savedLang) {
  i18n.locale = savedLang
} else {
  i18n.locale = getLocales()[0].languageCode ?? 'pt'
}

i18n.enableFallback = true

export default i18n