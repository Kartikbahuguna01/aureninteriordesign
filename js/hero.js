/**
 * hero.js — hero heading split + entrance animation (GSAP).
 */
(function (Auren) {
  const gsap = window.gsap;

  /** Wrap every word of the headline so each can slide up from behind a mask. */
  function splitWords(el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());

    el.innerHTML = [...el.childNodes]
      .map((node) => {
        if (node.nodeType !== Node.TEXT_NODE) return node.outerHTML; // keep <br>
        return node.textContent
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => `<span class="w" aria-hidden="true"><span class="wi">${word}</span></span>`)
          .join(' ');
      })
      .join(' ');
  }

  Auren.hero = {
    timeline: null,

    prepare() {
      document.querySelectorAll('.hero h1').forEach(splitWords);
    },

    animateIn() {
      // Phones: one short, simple fade-up (fast and cheap on slow devices).
      if (Auren.env.isPhone) {
        const quick = gsap.timeline({ defaults: { ease: 'power3.out' } });
        quick
          // The heading is animated in CSS (motion.css) so it never waits for GSAP.
          .from('.hero .explore, .hero .rate, .hero .hbrand, .hero .hcard',
            { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.06, clearProps: 'opacity,visibility,transform' }, 0.15);
        Auren.hero.timeline = quick;
        return quick;
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.from('.hero', { clipPath: 'inset(3% 3% 0% 3%)', duration: 1.6, clearProps: 'clipPath' }, 0)
        .from('.hero h1 .wi', { yPercent: 115, rotate: 3, transformOrigin: '0 100%', duration: 1.5, stagger: 0.09 }, 0.1)
        .from('.hero .explore', { autoAlpha: 0, duration: 1 }, 0.6)
        .from('.hero .rate, .hero .hbrand', { autoAlpha: 0, y: 30, duration: 1.1, stagger: 0.12 }, 0.6)
        .from('.hero .hcard', { autoAlpha: 0, y: 80, duration: 1.4 }, 0.55);

      Auren.hero.timeline = tl;
      return tl;
    },

    /** Last-resort cleanup if the entrance animation never finished. */
    forceVisible() {
      try {
        gsap.set('.hero h1, .hero h1 .wi, .hero .explore, .hero .rate, .hero .hbrand, .hero .hcard', {
          clearProps: 'opacity,visibility,transform',
        });
      } catch (err) { /* nothing to clean up */ }
    },
  };
})(window.Auren);
