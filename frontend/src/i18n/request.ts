import { getRequestConfig } from 'next-intl/server';
import { bazinga } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  let locale = bazinga.defaultLocale;

  if (requested && bazinga.locales.includes(requested as typeof bazinga.locales[number]))
    {
     locale = requested as typeof bazinga.locales[number];
   }

  return {
    locale,
    messages: (
      await import(`../translations/${locale}/translation.json`)
    ).default,
  };
});