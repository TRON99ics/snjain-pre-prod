/** Fixed navbar height — keep in sync with Navbar.jsx */
export const NAVBAR_HEIGHT_PX = 76;

export const HERO_GAP_VH_MIN = 500;
export const HERO_GAP_VH_MAX = 800;

/**
 * Extra top padding (px) when viewport height is 500–800px.
 * Clears navbar + scales gap as height shrinks toward 500px.
 */
export function calcHeroTopGapPx(viewportHeight) {
  if (viewportHeight < HERO_GAP_VH_MIN || viewportHeight > HERO_GAP_VH_MAX) {
    return null;
  }

  const range = HERO_GAP_VH_MAX - HERO_GAP_VH_MIN;
  const t = (HERO_GAP_VH_MAX - viewportHeight) / range;
  const gapBelowNav = 24 + t * 40;

  return Math.round(NAVBAR_HEIGHT_PX + gapBelowNav);
}

export function getViewportHeight() {
  if (typeof window === 'undefined') return 0;
  return window.visualViewport?.height ?? window.innerHeight;
}
