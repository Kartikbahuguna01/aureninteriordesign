/**
 * pointer-effects.js — mouse-driven effects (desktop with a fine pointer only):
 *   • 3D tilt + glow on cards
 *   • magnetic buttons and links
 *   • hero headline / card drift
 *   • custom two-part cursor
 */
(function (Auren) {
  const { gsap } = window;

  const TILT_TARGETS = '.cat, .svc, .tc, .hcard';
  const MAGNETIC_TARGETS = '.btn, .lnk'; // .explore stays put on hover
  const CURSOR_HOVER_TARGETS = 'a, button, .cat, .svc, .tc, input';

  /** Cards tilt towards the pointer and a soft light follows it. */
  function initCardTilt() {
    document.querySelectorAll(TILT_TARGETS).forEach((card) => {
      const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
      const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });

      card.addEventListener('pointermove', (event) => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;

        card.style.setProperty('--mx', x * 100 + '%');
        card.style.setProperty('--my', y * 100 + '%');

        gsap.set(card, { transformPerspective: 900 });
        rotateX((0.5 - y) * 6);
        rotateY((x - 0.5) * 8);
      });

      card.addEventListener('pointerleave', () => {
        rotateX(0);
        rotateY(0);
      });
    });
  }

  /** Buttons and links are gently pulled towards the pointer. */
  function initMagnetic() {
    document.querySelectorAll(MAGNETIC_TARGETS).forEach((el) => {
      const moveX = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1,.6)' });
      const moveY = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1,.6)' });

      el.addEventListener('pointermove', (event) => {
        const box = el.getBoundingClientRect();
        moveX((event.clientX - box.left - box.width / 2) * 0.22);
        moveY((event.clientY - box.top - box.height / 2) * 0.3);
      });

      el.addEventListener('pointerleave', () => {
        moveX(0);
        moveY(0);
      });
    });
  }

  /** Headline and card drift in opposite directions as the mouse moves. */
  function initHeroDrift() {
    const hero = document.querySelector('.hero');
    const driftHeading = gsap.quickTo('.hero h1', 'x', { duration: 1.2, ease: 'power3' });
    const driftCard = gsap.quickTo('.hero .hcard', 'x', { duration: 1.2, ease: 'power3' });

    hero.addEventListener('pointermove', (event) => {
      const offset = event.clientX / window.innerWidth - 0.5;
      driftHeading(offset * -18);
      driftCard(offset * 14);
    });

    hero.addEventListener('pointerleave', () => {
      driftHeading(0);
      driftCard(0);
    });
  }

  /** Small dot (instant) + ring (eased) that grows over interactive elements. */
  function initCursor() {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cur';
    ring.className = 'cur2';
    document.body.append(dot, ring);

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08 });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08 });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    window.addEventListener('pointermove', (event) => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3, overwrite: 'auto' });
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    });

    document.addEventListener('pointerover', (event) => {
      const interactive = event.target.closest && event.target.closest(CURSOR_HOVER_TARGETS);
      gsap.to(ring, { scale: interactive ? 1.9 : 1, duration: 0.4, overwrite: 'auto' });
    });

    document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0 }));
  }

  Auren.pointerEffects = {
    /** Card tilt, magnetic buttons and hero drift (called for desktop widths). */
    initDesktop() {
      initCardTilt();
      initMagnetic();
      initHeroDrift();
    },
    initCursor,
  };
})(window.Auren);
