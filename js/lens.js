/**
 * lens.js — cursor-trigger mask on the hero (desktop with a mouse only).
 *
 * Moving over the hero opens a soft circular window onto the un-tinted,
 * sun-lit photo. The window follows the cursor with inertia, swells over the
 * headline, and shrinks over links and cards so it never fights the UI.
 * Tweak RADIUS and EASE below. Skipped for reduced motion and touch devices.
 */
(function (Auren) {
  const { reducedMotion, finePointer, mobileMaxWidth } = Auren.env;
  const hero = document.querySelector('.hero');
  if (!hero || reducedMotion || !finePointer || window.innerWidth <= mobileMaxWidth) return;

  const RADIUS = { idle: 170, headline: 270, ui: 70 }; // px
  const EASE = { move: 0.13, size: 0.09 };              // 0–1, higher = snappier

  const lens = document.createElement('div');
  lens.className = 'lens';
  lens.setAttribute('aria-hidden', 'true');
  hero.insertBefore(lens, hero.firstChild);

  let x = 0, y = 0, tx = 0, ty = 0, r = 0, tr = 0, raf = 0, entered = false;

  function frame() {
    x += (tx - x) * EASE.move;
    y += (ty - y) * EASE.move;
    r += (tr - r) * EASE.size;

    lens.style.setProperty('--lx', x.toFixed(1) + 'px');
    lens.style.setProperty('--ly', y.toFixed(1) + 'px');
    lens.style.setProperty('--lr', r.toFixed(1) + 'px');

    const settled = Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3 && Math.abs(tr - r) < 0.3;
    raf = settled ? 0 : requestAnimationFrame(frame);
  }

  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    tx = event.clientX - box.left;
    ty = event.clientY - box.top;

    if (!entered) { x = tx; y = ty; entered = true; document.documentElement.classList.add('lens-on'); }

    const el = event.target;
    tr = el.closest('a, button, .hcard, .rate') ? RADIUS.ui
       : el.closest('h1') ? RADIUS.headline
       : RADIUS.idle;
    wake();
  });

  hero.addEventListener('pointerleave', () => {
    tr = 0;
    entered = false;
    document.documentElement.classList.remove('lens-on');
    wake();
  });
})(window.Auren);
