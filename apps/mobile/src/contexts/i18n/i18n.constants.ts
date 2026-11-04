const supportedLanguages = ['pt', 'en']

function isLanguageSupported(lang: string) {
  return supportedLanguages.includes(lang)
}

const I18N_CONSTANTS = {
  isLanguageSupported
}

export default I18N_CONSTANTS