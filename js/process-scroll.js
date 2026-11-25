/**
 * process-scroll.js — pinned scroll story for "Our Design Process".
 *
 * Desktop only (≥ 1101px, motion allowed). The five .proc rows are cloned into
 * a tall .pstage; its inner .pin is `position: sticky`, so the section stays
 * on screen while scroll progress picks the active step. This script only
 * toggles classes (.vis / .on / .past) and the --p variable; every motion is
 * a CSS transition in css/process-scroll.css.
 */
(function (Auren) {
  if (Auren.env.reducedMotion) return;

  const desktop = matchMedia('(min-width: 1101px)');
  const rows = [...document.querySelectorAll('#process .proc')];
  if (!rows.length) return;

  let stage, imgs, texts, labels, active = -1, built = false;

  function build() {
    built = true;
    const n = rows.length;
    const clean = (node) => {
      node.classList.remove('rv', 'in');
      node.querySelectorAll('.rv, .in').forEach((el) => el.classList.remove('rv', 'in'));
      node.style.removeProperty('--d');
      return node;
    };

    stage = document.createElement('div');
    stage.className = 'pstage';
    stage.style.setProperty('--n', n);
    stage.innerHTML =
      '<div class="pin"><div class="pgrid"><div class="pimgs"></div><div class="ptexts"></div></div>' +
      '<div class="pprog" aria-hidden="true"></div></div>';

    const imgBox = stage.querySelector('.pimgs');
    const textBox = stage.querySelector('.ptexts');
    const rail = stage.querySelector('.pprog');

    rows.forEach((row) => {
      imgBox.appendChild(clean(row.querySelector('.im').cloneNode(true)));
      const text = clean([...row.children].find((c) => !c.classList.contains('im')).cloneNode(true));
      textBox.appendChild(text);

      const label = document.createElement('span');
      label.textContent = text.querySelector('.n').textContent + '  ' + text.querySelector('h3').textContent;
      rail.appendChild(label);
    });

    rows[0].parentNode.insertBefore(stage, rows[0]);
    imgs = [...imgBox.children];
    texts = [...textBox.children];
    labels = [...rail.children];
    document.documentElement.classList.add('pst');
    update();
  }

  function update() {
    if (!built || !desktop.matches) return;
    const box = stage.getBoundingClientRect();
    const pin = stage.firstElementChild;
    const pinTop = parseFloat(getComputedStyle(pin).top) || 0;
    const range = box.height - pin.offsetHeight;          // distance the pin travels while stuck
    const p = Math.min(1, Math.max(0, (pinTop - box.top) / range));
    const i = Math.min(rows.length - 1, Math.floor(p * rows.length));

    stage.style.setProperty('--p', p.toFixed(4));
    if (i === active) return;
    active = i;

    imgs.forEach((el, j) => el.classList.toggle('vis', j <= i));
    texts.forEach((el, j) => {
      el.classList.toggle('on', j === i);
      el.classList.toggle('past', j < i);
    });
    labels.forEach((el, j) => el.classList.toggle('on', j <= i));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });

  window.addEventListener('resize', update);
  const start = () => { if (desktop.matches && !built) build(); };
  desktop.addEventListener('change', start);
  start();
})(window.Auren);
