// Shared JavaScript for Dr. Shyamsunder website
const $ = s => document.querySelector(s),
      $$ = s => [...document.querySelectorAll(s)],
      RM = matchMedia('(prefers-reduced-motion:reduce)').matches,
      FINE = matchMedia('(pointer:fine)').matches;

// Preloader (Home page only)
const pre = $('#pre');
function start() {
  document.body.classList.add('go');
  document.body.classList.remove('lock');
}
function endPre() {
  if (!pre) return;
  pre.classList.add('out');
  start();
  try { sessionStorage.s = 1; } catch (e) {}
  setTimeout(() => pre.remove(), 1100);
}
if (pre) {
  if (!RM && !document.documentElement.classList.contains('seen')) {
    document.body.classList.add('lock');
    setTimeout(endPre, 3400);
  } else {
    pre.remove();
    start();
  }
} else {
  start();
}

// Droplets animation in hero
if (!RM && $('#pts')) {
  const c = $('#pts');
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('span'),
          s = 6 + Math.random() * 14;
    p.className = 'pt';
    p.style.cssText = `width:${s}px;height:${s * 1.3}px;left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 10}s;animation-delay:${-Math.random() * 16}s`;
    c.appendChild(p);
  }
}

// Typewriter animation in hero
const ph = ['Chronic kidney disease care', 'Dialysis guidance', 'Kidney transplant follow-up', 'Diabetic kidney care', 'Kidney stone evaluation'],
      ty = $('#ty');
if (!RM && ty) {
  let i = 0, j = 0, del = false;
  (function tick() {
    const w = ph[i];
    j += del ? -1 : 1;
    ty.textContent = w.slice(0, j);
    let d = del ? 35 : 70;
    if (!del && j === w.length) {
      del = true;
      d = 1400;
    } else if (del && j === 0) {
      del = false;
      i = (i + 1) % ph.length;
      d = 350;
    }
    setTimeout(tick, d);
  })();
}

// Scroll reveal animations
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const t = e.target, k = Math.min([...t.parentNode.children].indexOf(t), 6);
  t.style.setProperty('--d', k * .09 + 's');
  t.classList.add('in');
  io.unobserve(t);
}), { threshold: .12 });
$$('.rv').forEach(e => io.observe(e));

// Scroll progress bar, header shrink, back-to-top button, parallax
const bar = $('#bar'), up = $('.up'), hd = $('#hd'), sp = $$('[data-sp]');
function onScroll() {
  const h = document.documentElement,
        y = h.scrollTop,
        m = h.scrollHeight - h.clientHeight;
  if (bar) bar.style.width = (m > 0 ? y / m * 100 : 0) + '%';
  if (hd) hd.classList.toggle('sc', y > 20);
  if (up) up.classList.toggle('s', y > 700);
  if (!RM && sp.length) sp.forEach(b => b.style.translate = '0 ' + y * b.dataset.sp + 'px');
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();
if (up) up.onclick = () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });

// 3D Card tilt, cursor glow, magnetic buttons
if (FINE && !RM) {
  const g = $('#glow');
  if (g) {
    addEventListener('mousemove', e => {
      g.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    });
  }
  $$('.card').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect(),
            x = (e.clientX - r.left) / r.width,
            y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', x * 100 + '%');
      c.style.setProperty('--my', y * 100 + '%');
      c.style.setProperty('--ry', (x - .5) * 10 + 'deg');
      c.style.setProperty('--rx', (.5 - y) * 10 + 'deg');
    });
    c.addEventListener('mouseleave', () => {
      c.style.setProperty('--rx', '0deg');
      c.style.setProperty('--ry', '0deg');
    });
  });
  $$('.mag').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
}

// Conditions tabs toggle
$$('.tabs button').forEach(b => b.onclick = () => {
  $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
  $$('.pn').forEach((p, i) => p.classList.toggle('on', i == b.dataset.t));
});

// Flip cards toggle
$$('.flip').forEach(f => f.onclick = () => f.classList.toggle('on'));

// FAQ accordion (single-open)
$$('details').forEach(d => d.addEventListener('toggle', () => {
  if (d.open) $$('details').forEach(o => { if (o !== d) o.open = false; });
}));

// Mobile navigation menu toggle
const bg = $('#bg'), nv = $('#nv');
if (bg && nv) {
  bg.onclick = () => nv.classList.toggle('open');
  $$('#nv a').forEach(a => a.addEventListener('click', () => nv.classList.remove('open')));
}

// Phone and WhatsApp handlers
const PH = '919745866333', NUM = '+91 97458 66333';
function toast(m) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = m;
  t.classList.add('s');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('s'), 4500);
}

// Desktop: intercept tel: links, copy number to clipboard and show toast
if (!matchMedia('(pointer:coarse)').matches) {
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    e.preventDefault();
    try {
      navigator.clipboard.writeText(NUM).catch(() => {});
    } catch (_) {}
    toast('Please call ' + NUM + ' from your phone. Number copied.');
  });
}

// Appointment form handler: format message and open WhatsApp
document.addEventListener('submit', e => {
  if (e.target.id !== 'bk') return;
  e.preventDefault();
  const f = e.target.elements, v = k => (f[k] && f[k].value || '').trim();
  const L = [
    'Hello Dr. Shyamsunder, I would like to book an appointment.',
    'Name: ' + v('n'),
    'Phone: ' + v('p')
  ];
  if (v('d')) L.push('Preferred date: ' + v('d'));
  if (v('m')) L.push('Reason: ' + v('m'));
  const url = 'https://wa.me/' + PH + '?text=' + encodeURIComponent(L.join('\n'));
  e.target.innerHTML = '<h3>Almost done</h3><p>Your request is ready. Tap the button to send it on WhatsApp, or call ' + NUM + '.</p><p style="margin-top:16px"><a class="btn g" href="' + url + '" target="_blank" rel="noopener">Send on WhatsApp</a></p>';
  try {
    window.open(url, '_blank', 'noopener');
  } catch (_) {}
});

// Update copyright year
const yr = $('#yr');
if (yr) yr.textContent = new Date().getFullYear();

