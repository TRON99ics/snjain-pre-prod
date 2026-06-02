import { useEffect, useState } from 'react';
import { calcHeroTopGapPx, getViewportHeight } from '../lib/heroTopGap';

/**
 * Returns inline padding-top (px) for hero content when viewport height is 500–800px.
 */
export default function useHeroTopGap() {
  const [topGapPx, setTopGapPx] = useState(() => {
    if (typeof window === 'undefined') return null;
    return calcHeroTopGapPx(getViewportHeight());
  });

  useEffect(() => {
    const update = () => {
      setTopGapPx(calcHeroTopGapPx(getViewportHeight()));
    };

    update();
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);

    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);

  return topGapPx;
}
