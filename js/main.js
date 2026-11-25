/**
 * main.js — application entry point. Loads last and wires the modules together.
 *
 * Order of work
 *   1. Bail out gracefully if GSAP is missing or the user prefers reduced motion
 *      (the site is fully usable without animation).
 *   2. Prepare the DOM for animation (split headline, wrap images, add glow layers).
 *   3. Register scroll + pointer effects.
 *   4. Play the intro (first visit) or the hero entrance directly.
 */
(function (Auren) {
  const root = document.documentElement;
  const { gsap, ScrollTrigger } = window;
  const { reducedMotion, finePointer, mobileMaxWidth } = Auren.env;

  if (!gsap || !ScrollTrigger || reducedMotion) {
    root.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  Auren.smoothScroll.init(gsap, ScrollTrigger);

  /* ---------- 1. Prepare the DOM ---------- */

  // Phones get a lightweight entrance, so the headline is not split into words.
  if (!Auren.env.isPhone) Auren.hero.prepare();

  // Wrap product images so the hover zoom is clipped to the card.
  document.querySelectorAll('.prod img').forEach((img) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'pm';
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
  });

  // Add the pointer-glow layer to cards.
  document.querySelectorAll('.cat, .svc, .tc, .hcard').forEach((card) => {
    const glow = document.createElement('i');
    glow.className = 'gl';
    card.appendChild(glow);
  });

  /* ---------- 2. Scroll + pointer effects ---------- */

  gsap.matchMedia().add(
    { desktop: `(min-width: ${mobileMaxWidth + 1}px)`, mobile: `(max-width: ${mobileMaxWidth}px)` },
    (context) => {
      const isDesktop = context.conditions.desktop;
      Auren.scrollEffects.initParallax(isDesktop);
      if (isDesktop && finePointer) Auren.pointerEffects.initDesktop();
    }
  );

  Auren.scrollEffects.initPageLevel();
  if (finePointer) Auren.pointerEffects.initCursor();

  /* ---------- 3. Entrance ---------- */

  function start() {
    if (Auren.intro.shouldPlay()) {
      Auren.intro.play();
    } else {
      Auren.hero.animateIn();
    }
  }

  // Desktop waits for web fonts (max 0.9s) so text does not jump when the animation
  // starts. Phones start immediately: the heading must never wait on the network.
  if (Auren.env.isPhone) {
    start();
  } else {
    Promise.race([
      document.fonts ? document.fonts.ready : 0,
      new Promise((resolve) => setTimeout(resolve, 900)),
    ]).then(start);
  }

  // Safety net: after 9s make sure nothing is stuck invisible.
  setTimeout(() => {
    root.classList.remove('js');
    const tl = Auren.hero.timeline;
    if (!tl || tl.progress() < 1) Auren.hero.forceVisible();
  }, Auren.env.isPhone ? 3000 : 9000);

  /* ---------- 4. Keep trigger positions accurate while images load ---------- */

  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 1200);
  setTimeout(() => ScrollTrigger.refresh(), 3000);
})(window.Auren);
