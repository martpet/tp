import { useProvider } from '@adobe/react-spectrum';
import { useLayoutEffect } from 'react';

export const useThemeColorMetaTag = () => {
  const { colorScheme } = useProvider();
  const metaEl = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;

  useLayoutEffect(() => {
    if (metaEl) {
      metaEl.content = colorScheme === 'dark' ? 'rgb(29, 29, 29' : 'rgb(248, 248, 248);';
    }
  }, [colorScheme]);
};
