import { defaultLanguage } from '~/common/consts/defaultLanguage';
import { languages } from '~/common/consts/languages';
import { Language } from '~/common/types';

const getIds = async (language: Language) => {
  const { default: messages } = await import(`~/../lang/${language}.json`);
  return Object.keys(messages).sort();
};

const defaultLangIds = await getIds(defaultLanguage);

const languagesToTest = languages.filter((lang) => lang !== defaultLanguage);

describe('Translations', () => {
  test.each(languagesToTest)('Language `%s` has correct ids', async (language) => {
    const ids = await getIds(language);
    expect(ids).toEqual(defaultLangIds);
  });
});
