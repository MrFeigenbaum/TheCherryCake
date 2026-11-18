import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setLanguage } from '../store/languageSlice';
import { getUIText, getEasterEggTexts, LANGUAGES, type SupportedLanguage } from './translations';

export function useTranslation() {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state: RootState) => state.language?.current) || 'en';

  const t = (key: string, fallback?: string) => getUIText(currentLanguage, key, fallback);
  const easterEgg = getEasterEggTexts(currentLanguage);

  const changeLanguage = (lang: SupportedLanguage | string) => {
    dispatch(setLanguage(lang));
  };

  return {
    language: currentLanguage,
    t,
    easterEgg,
    changeLanguage,
    languages: LANGUAGES,
  };
}

export default useTranslation;
