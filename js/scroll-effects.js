/**
 * scroll-effects.js — everything driven by scroll position (GSAP ScrollTrigger):
 *   • parallax on the hero, about photo and process photos (desktop only)
 *   • background colour hand-off between sections
 *   • active link in the desktop navigation
 *   • compact header once the page is scrolled
 */
(function (Auren) {
  const { gsap, ScrollTrigger } = window;

  /** Section background colours, in page order (index matches <main> > section). */
  const SECTION_BACKGROUNDS = ['#ffffff', '#f8f4ea', '#efe8d8', '#ffffff', '#f3eee1', '#ffffff'];

  /** Nav link → the element that marks the start of its section. */
  const NAV_SECTIONS = { '#home': '.hero', '#shop': '#shop', '#about': '#about', '#services': '#services' };

  const parallax = (target, trigger, from, to, endEdge = 'bottom top', startEdge = 'top top') =>
    gsap.fromTo(target, { yPercent: from }, {
      yPercent: to,
      ease: 'none',
      scrollTrigger: { trigger, start: startEdge, end: endEdge, scrub: 0.6 },
    });

  /** Parallax + hero fade. `isDesktop` comes from gsap.matchMedia in main.js. */
  function initParallax(isDesktop) {
    gsap.to('.hero h1', {
      yPercent: isDesktop ? 28 : 12,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });

    if (!isDesktop) return;

    gsap.to('.hero .hcard', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });

    document.querySelectorAll('.proc').forEach((row) => {
      parallax(row.querySelector('.im img'), row, -6, 6, 'bottom top', 'top bottom');
    });

    parallax('.about .img img', '.about', -6, 6, 'bottom top', 'top bottom');
  }

  /** Cross-fade the page background as each section becomes dominant. */
  function initBackgroundHandoff() {
    document.querySelectorAll('main > section').forEach((section, index) => {
      const colour = SECTION_BACKGROUNDS[index] || '#fff';
      const apply = () => gsap.to(document.body, { backgroundColor: colour, duration: 0.9, ease: 'power2.out', overwrite: true });

      ScrollTrigger.create({ trigger: section, start: 'top 60%', end: 'bottom 60%', onEnter: apply, onEnterBack: apply });
    });
  }

  /** Highlight the nav link for the section currently in view. */
  function initActiveNav() {
    Object.entries(NAV_SECTIONS).forEach(([hash, trigger]) => {
      const activate = () => {
        document.querySelectorAll('nav a').forEach((link) => {
          link.classList.toggle('on', link.getAttribute('href') === hash);
        });
      };

      ScrollTrigger.create({ trigger, start: 'top 50%', end: 'bottom 50%', onEnter: activate, onEnterBack: activate });
    });
  }

  /** Shrink the header after the first 40px of scrolling. */
  function initHeaderState() {
    const header = document.querySelector('header');
    ScrollTrigger.create({
      start: 40,
      end: 'max',
      onToggle: (self) => header.classList.toggle('sc', self.isActive),
    });
  }

  Auren.scrollEffects = {
    initParallax,
    initPageLevel() {
      initBackgroundHandoff();
      initActiveNav();
      initHeaderState();
    },
  };
})(window.Auren);
