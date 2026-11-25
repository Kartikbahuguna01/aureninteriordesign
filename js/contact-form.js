/**
 * contact-form.js — footer "Get in Touch" form.
 * Opens the visitor's email app with a pre-filled enquiry (no backend needed).
 * Swap this for a fetch() call if you later add a server endpoint.
 */
(function () {
  const STUDIO_EMAIL = 'hello@aurenstudio.com';

  const form = document.getElementById('contact-form');
  const emailInput = document.getElementById('contact-email');
  if (!form || !emailInput) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const subject = encodeURIComponent('Enquiry from AUREN website');
    const body = encodeURIComponent('Please contact me at: ' + emailInput.value);

    window.location.href = `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
  });
})();
