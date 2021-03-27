import { createI18n } from 'vue-i18n';
import { Router } from 'vue-router';
import { I18n, LOCALES, DEFAULT_LOCALE, loadLocaleMessages, setI18nLanguage } from '~/locales/utils';

export * from '~/locales/utils';

const PRODUCTION = import.meta.env.PROD;

export function setupRouterForI18n(i18n: I18n, router: Router) {
  // Guard for auto load messages & set locale.
  router.beforeEach(async (to, _, next) => {
    const paramLocale = to.params.locale as string;

    // Check if got the right locales.
    if (!LOCALES.includes(paramLocale)) {
      return next({ name: 'home', params: { locale: DEFAULT_LOCALE } });
    }

    // Cancel loading if already loaded.
    if (!i18n.global.availableLocales.includes(paramLocale)) {
      await loadLocaleMessages(i18n, paramLocale);
    }

    setI18nLanguage(i18n, paramLocale);

    return next();
  });
}

export function setupI18n(router: Router) {
  const i18n = createI18n({
    legacy: false,
    fallbackLocale: DEFAULT_LOCALE,
    missingWarn: PRODUCTION,
    fallbackWarn: PRODUCTION,
  }) as I18n;

  setupRouterForI18n(i18n, router);

  return i18n;
}