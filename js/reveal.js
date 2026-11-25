/**
 * reveal.js — fade-and-rise animation as sections scroll into view.
 *
 * Works without GSAP. Elements get `.rv` (hidden, shifted down) and, once
 * visible, `.in`. The classes are removed again after the transition so they
 * cannot interfere with hover effects. See "Scroll reveal" in animations.css.
 */
(function (Auren) {
  const root = document.documentElement;

  const SELECTOR = [
    'section h2', '.cta h2', '.sub', '.cat', '.prod', '.about .img',
    '.about > div:last-child > *', '.svc', '.proc .im',
    '.proc > div:not(.im) > *', '.t3 .tc', '.cta form', '.fp', '.center',
  ].join(',');

  const STAGGER_MS = 110;
  const MAX_STAGGER_STEPS = 6;
  const CLEANUP_MS = 2200;

  try {
    const items = [...document.querySelectorAll(SELECTOR)];

    // Mark every element (except the hero) and stagger siblings.
    items.forEach((el) => {
      if (el.closest('.hero')) return;
      el.classList.add('rv');

      const siblings = [...el.parentNode.children].filter(
        (child) => child.classList.contains('rv') || child === el
      );
      const step = Math.min(siblings.indexOf(el), MAX_STAGGER_STEPS);
      el.style.setProperty('--d', step * STAGGER_MS + 'ms');
    });

    function show(el) {
      if (el.classList.contains('in')) return;
      el.classList.add('in');
      setTimeout(() => {
        el.classList.remove('rv', 'in');
        el.style.removeProperty('--d');
      }, CLEANUP_MS);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            show(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px 12% 0px', threshold: 0 }
      );
      items.forEach((el) => el.classList.contains('rv') && observer.observe(el));
    } else {
      items.forEach(show);
    }

    Auren.revealReady = true;

    // Safety net: anything on screen but still hidden is shown.
    const revealVisible = () => {
      items.forEach((el) => {
        if (!el.classList.contains('rv') || el.classList.contains('in')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.1 && rect.bottom > -50) show(el);
      });
    };

    window.addEventListener('scroll', revealVisible, { passive: true });
    setInterval(revealVisible, 700);
    setTimeout(revealVisible, 300);
  } catch (err) {
    // If anything goes wrong, never leave content hidden.
    Auren.revealReady = false;
    root.classList.remove('rvon');
  }
})(window.Auren);
