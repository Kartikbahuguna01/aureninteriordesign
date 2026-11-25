/**
 * intro.js — one-time splash screen, then hands over to the hero animation.
 */
(function (Auren) {
  const root = document.documentElement;
  const SESSION_KEY = 'au';

  Auren.intro = {
    /** True when the splash markup exists and boot.js enabled it. */
    shouldPlay() {
      return Boolean(document.querySelector('#intro')) && root.classList.contains('js');
    },

    play() {
      const { gsap, ScrollTrigger } = window;

      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (err) { /* private mode */ }

      const logo = document.querySelector('.in-logo');
      logo.innerHTML = 'AUREN'.split('').map((char) => `<span>${char}</span>`).join('');

      gsap.timeline({
        onComplete() {
          root.classList.remove('js');
          ScrollTrigger.refresh();
        },
      })
        .from('.in-logo span', { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
        .from('.in-line', { scaleX: 0, duration: 0.9, ease: 'expo.inOut' }, 0.15)
        .from('.in-sub', { autoAlpha: 0, y: 12, filter: 'blur(6px)', duration: 0.8, ease: 'power3.out' }, 0.4)
        .to('.in-logo', { scale: 1.05, duration: 0.6, ease: 'power1.inOut' }, 0.7)
        .to('#intro', { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut' }, 1.05)
        .add(Auren.hero.animateIn, 1.4);
    },
  };
})(window.Auren);
