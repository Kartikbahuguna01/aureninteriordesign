/**
 * smooth-scroll.js — thin wrapper around Lenis (inertial smooth scrolling).
 *
 * Lenis is only enabled for desktop mouse users. On touch devices and when
 * Lenis fails to load, every method falls back to native browser scrolling,
 * so the rest of the code never has to check.
 */
(function (Auren) {
  let lenis = null;

  Auren.smoothScroll = {
    /** Start Lenis and keep ScrollTrigger in sync with it. */
    init(gsap, ScrollTrigger) {
      if (!Auren.env.finePointer || !window.Lenis) return;

      lenis = new window.Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    },

    /** Freeze scrolling (used while the mobile menu is open). */
    pause() {
      if (lenis) lenis.stop();
    },

    resume() {
      if (lenis) lenis.start();
    },

    /** Scroll the page to a vertical position (in px). */
    scrollTo(y) {
      if (lenis) {
        lenis.scrollTo(y, { duration: 1.4 });
      } else {
        window.scrollTo({ top: y, behavior: Auren.env.reducedMotion ? 'auto' : 'smooth' });
      }
    },
  };
})(window.Auren);
