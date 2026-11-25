/**
 * menu.js — mobile navigation panel.
 *
 * Opens with the hamburger button and closes with:
 *   • the cross (✕) button inside the panel
 *   • the Escape key
 *   • tapping any link in the panel (handled in navigation.js)
 *   • crossing the phone/desktop breakpoint
 *   • (desktop) clicking the hamburger again or clicking outside the card
 *
 * Public API: Auren.menu.open() / close() / isOpen()
 */
(function (Auren) {
  const root = document.documentElement;
  const header = document.querySelector('header');
  const toggleBtn = document.getElementById('menu-toggle');
  const panel = document.getElementById('menu-panel');
  const closeBtn = document.getElementById('menu-close');

  if (!header || !toggleBtn || !panel || !closeBtn) return;

  const phoneQuery = matchMedia(`(max-width: ${Auren.env.mobileMaxWidth}px)`);
  let isOpen = false;

  /**
   * @param {boolean} open          Target state.
   * @param {boolean} [restoreFocus] Move focus back to the hamburger when closing.
   */
  function setOpen(open, restoreFocus = false) {
    if (open === isOpen) return;
    isOpen = open;

    panel.classList.toggle('open', open);
    header.classList.toggle('mo', open);
    root.classList.toggle('mo', open); // locks page scroll (see mobile-menu.css)
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.setAttribute('aria-hidden', String(!open));

    if (open) {
      Auren.smoothScroll.pause();
      closeBtn.focus({ preventScroll: true });
    } else {
      Auren.smoothScroll.resume();
      if (restoreFocus) toggleBtn.focus({ preventScroll: true });
    }
  }

  Auren.menu = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: () => isOpen,
  };

  toggleBtn.addEventListener('click', () => setOpen(!isOpen, true));
  closeBtn.addEventListener('click', () => setOpen(false, true));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) setOpen(false, true);
  });

  // Desktop: clicking outside the card closes it
  document.addEventListener('click', (event) => {
    if (!isOpen || phoneQuery.matches) return;
    if (panel.contains(event.target) || toggleBtn.contains(event.target)) return;
    setOpen(false);
  });

  // Switching between phone and desktop layouts closes the menu
  phoneQuery.addEventListener('change', () => setOpen(false));
})(window.Auren);
