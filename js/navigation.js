/**
 * navigation.js — in-page anchor links (#shop, #about, …).
 *
 * Intercepts clicks on `a[href^="#"]` and scrolls smoothly. When the link is
 * inside the open mobile menu, the menu closes first and the scroll starts
 * after its closing animation so the page does not jump underneath it.
 */
(function (Auren) {
  const MENU_CLOSE_DELAY = 450; // ms

  function scrollToHash(hash) {
    const target = hash === '#home' ? null : document.querySelector(hash);
    const y = target ? target.getBoundingClientRect().top + window.pageYOffset : 0;
    Auren.smoothScroll.scrollTo(y);
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    event.preventDefault();
    const hash = link.getAttribute('href');

    const menuWasOpen = Auren.menu && Auren.menu.isOpen();
    if (menuWasOpen) Auren.menu.close();

    if (hash.length < 2) return; // bare "#" placeholder link

    if (menuWasOpen) {
      setTimeout(() => scrollToHash(hash), MENU_CLOSE_DELAY);
    } else {
      scrollToHash(hash);
    }
  });
})(window.Auren);
