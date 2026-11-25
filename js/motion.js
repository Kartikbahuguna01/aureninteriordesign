/**
 * motion.js — the two effects that need JavaScript.
 *   • Daylight: a fixed, barely-there colour wash that drifts from cool
 *     morning light to warm golden light to dusk as you scroll the page.
 *   • Liquid buttons: records where the cursor entered / left a button so
 *     the CSS fill (see motion.css) grows from that exact point.
 * Everything else lives in css/motion.css. Skipped for reduced motion.
 */
(function (Auren) {
  const { gsap, ScrollTrigger } = window;
  const { reducedMotion, finePointer, mobileMaxWidth } = Auren.env;
  if (reducedMotion) return;

  // Liquid buttons (mouse only)
  if (finePointer) {
    document.querySelectorAll('.btn').forEach((btn) => {
      const setOrigin = (event) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--bx', ((event.clientX - r.left) / r.width) * 100 + '%');
        btn.style.setProperty('--by', ((event.clientY - r.top) / r.height) * 100 + '%');
      };
      btn.addEventListener('pointerenter', setOrigin);
      btn.addEventListener('pointerleave', setOrigin);
    });
  }

  // Daylight shift (desktop only)
  if (!gsap || !ScrollTrigger || window.innerWidth <= mobileMaxWidth) return;

  const wash = document.createElement('div');
  wash.className = 'daylight';
  wash.setAttribute('aria-hidden', 'true');
  document.body.appendChild(wash);

  gsap.timeline({
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
  })
    .fromTo(wash, { backgroundColor: 'rgba(196,210,222,0.06)' }, { backgroundColor: 'rgba(255,196,120,0.09)', ease: 'none', duration: 1 })
    .to(wash, { backgroundColor: 'rgba(120,88,48,0.07)', ease: 'none', duration: 1 });
})(window.Auren);
