import { useProvider } from '@adobe/react-spectrum';
import { useLayoutEffect } from 'react';

export const useThemeColorMetaTag = () => {
  const { colorScheme } = useProvider();
  const metaEl = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;

  useLayoutEffect(() => {
    if (metaEl) {
      metaEl.content = colorScheme === 'dark' ? 'rgb(30, 30, 30' : 'rgb(245, 245, 245)';
    }
  }, [colorScheme]);
};
