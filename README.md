# AUREN Studio

Marketing site for AUREN Studio, an interior design studio in Delhi. Plain HTML, CSS and JavaScript — no build step.

## Run it

Open `index.html` in a browser. For the best result serve the folder locally:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

GSAP, ScrollTrigger and Lenis load from a CDN, and fonts from Google Fonts, so an internet connection is needed for animations and the intended typography. The site still works without them.

## Project structure

```
index.html            Page markup
css/
  tokens.css          Colours, fonts, footer heading weight, background images
  base.css            Reset, containers, headings, buttons, links
  header.css          Sticky header and desktop navigation
  mobile-menu.css     Phone menu: hamburger, full-screen panel, close (✕) button
  hero.css            Hero section
  sections.css        Categories, products, about, services, process, testimonials
  footer.css          Footer call-to-action and info panel
  intro.css           First-visit splash screen
  animations.css      Hover effects, cursor, scroll reveal
  responsive.css      Tablet (≤1100px) and phone (≤760px) layout
js/
  boot.js             Runs first: shared namespace, user preferences, safety timeouts
  smooth-scroll.js    Lenis wrapper
  menu.js             Phone menu open / close
  navigation.js       In-page anchor links
  reveal.js           Scroll-reveal
  contact-form.js     Footer email form
  hero.js             Hero headline split and entrance animation
  scroll-effects.js   Parallax, background hand-off, active nav, compact header
  pointer-effects.js  Card tilt, magnetic buttons, custom cursor
  intro.js            Splash screen
  main.js             Wires everything together (loads last)
assets/images/        All photos (extracted from the original single file)
```

## Common tweaks

- **Footer heading weight** (“Make room for inspiration…”): `--footer-heading-weight` in `css/tokens.css` (300 = light, 400 = regular).
- **Phone breakpoint**: `760px` in `css/responsive.css`, `css/mobile-menu.css` and `mobileMaxWidth` in `js/boot.js` — keep them in sync.
- **Contact email**: `STUDIO_EMAIL` in `js/contact-form.js`.
