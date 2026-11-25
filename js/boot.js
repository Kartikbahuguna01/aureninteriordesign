/**
 * boot.js — runs synchronously in <head>, before first paint.
 *
 * Responsibilities
 *  1. Create the shared `Auren` namespace and detect user preferences.
 *  2. Add the `rvon` class (scroll-reveal active) and the `js` class
 *     (intro splash visible) so the page never flashes unstyled content.
 *  3. Add safety timeouts so content can never stay hidden if a script fails.
 */
(function () {
  const root = document.documentElement;

  const env = {
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
    mobileMaxWidth: 760, // keep in sync with the phone breakpoint in css/responsive.css
  };
  env.isPhone = matchMedia(`(max-width: ${env.mobileMaxWidth}px)`).matches;

  window.Auren = { env, revealReady: false };

  // Load web fonts without blocking rendering (text shows in a fallback font, then swaps).
  const fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = 'https://fonts.googleapis.com/css2?family=Intel+One+Mono:wght@300;400;500;700&family=Inter:wght@100;200;300;400;500&display=swap';
  document.head.appendChild(fonts);

  if (env.reducedMotion) return;

  // Scroll reveal: hide elements until they scroll into view.
  root.classList.add('rvon');
  setTimeout(() => {
    if (!window.Auren.revealReady) root.classList.remove('rvon');
  }, 4000);

  // Intro splash: first visit only, and never on phones (it delayed the hero heading).
  try {
    if (!env.isPhone && !sessionStorage.getItem('au')) {
      root.classList.add('js');
      setTimeout(() => root.classList.remove('js'), 6000);
    }
  } catch (err) {
    /* sessionStorage unavailable (private mode) — skip the intro. */
  }
})();
