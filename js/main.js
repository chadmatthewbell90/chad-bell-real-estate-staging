/* ============================================================
   CHAD BELL REAL ESTATE — main.js
   Nav, smooth scroll, scroll reveals, split-word hero heading,
   scroll-lit statement, count-ups, parallax, magnetic buttons,
   phone tilt, process line, sticky CTAs, valuation form.
   All motion respects prefers-reduced-motion.
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const WHATSAPP      = '27845206603';
// Google Apps Script web app that adds each valuation lead to Chad's Google Sheet
// (code in scripts/valuation-leads.gs). Empty = leads go to WhatsApp only.
const LEADS_URL     = 'https://script.google.com/macros/s/AKfycbxMStY5Ai2RiYjPdQ7KrHJI0iBB8D1PNY-1g_NPVhhP8pC9D9TBFjRpceUHFUhwqig/exec';

/* ── Year ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Scroll progress bar ── */
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,var(--coral),var(--gold));z-index:200;pointer-events:none;';
document.body.prepend(progressBar);

/* ── Nav: background after scrolling, hides on the way down, back on the way up ── */
const nav      = document.getElementById('nav');
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
let lastY = window.scrollY;

function closeMenu() {
  if (!navLinks) return;
  navLinks.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    nav.classList.remove('hide');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* ── Smooth scroll with nav offset ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = anchor.hash && document.querySelector(anchor.hash);
    if (!target) return;
    e.preventDefault();
    const navH = nav ? nav.offsetHeight : 0;
    // A target with its own scroll-margin-top (the valuation form) sets its own gap below the nav
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || (navH - 1);
    const top  = anchor.hash === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY - margin;
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

/* ── Active nav link ── */
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)');
const sections   = document.querySelectorAll('section[id]');

/* ── Split heading into words that rise into place ── */
function splitWords(el) {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.transitionDelay = `${120 + i++ * 70}ms`;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        child.replaceWith(frag);
      } else if (child.tagName === 'EM') {
        // Animate the gradient phrase as one unit: background-clip:text
        // doesn't paint into transformed children, so don't split inside it.
        const outer = document.createElement('span');
        outer.className = 'split-word';
        const inner = document.createElement('span');
        inner.style.transitionDelay = `${120 + i++ * 70}ms`;
        child.replaceWith(outer);
        inner.appendChild(child);
        outer.appendChild(inner);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
  el.classList.add('is-split');
}

/* ── Statement: each word lights up as it scrolls through the viewport ── */
const statement = document.querySelector('[data-words]');
let statementWords = [];
if (statement && !reducedMotion) {
  const wrap = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrap(child);
      }
    });
  };
  wrap(statement);
  statementWords = [...statement.querySelectorAll('.w')];
}

/* ── Scroll reveals ── */
if ('IntersectionObserver' in window && !reducedMotion) {
  const heroHeading = document.querySelector('[data-split]');
  if (heroHeading) splitWords(heroHeading);

  const groups = [
    ['.hero__eyebrow, .hero__sub, .hero__actions, .hero__proof', '', true, 500],
    ['.hero__visual', 'reveal--scale', false, 300],
    ['.eyebrow:not(.hero__eyebrow), .section__heading, .section__sub', '', false],
    ['.stat', '', true],
    ['.why-card', '', true],
    ['.feature', 'reveal--right', true],
    ['.marketing__phones', 'reveal--scale', false],
    ['.award__body > p, .award__body > .btn', '', true],
    ['.step', 'reveal--left', true],
    ['.pill', '', true],
    ['.faq__item', '', true],
    ['.valuation__info .contact__item, .socials', 'reveal--right', true],
    ['.footer__big', '', false],
  ];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  groups.forEach(([selector, variant, stagger, base = 0]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      if (variant) el.classList.add(variant);
      const delay = base + (stagger ? (i % 6) * 90 : 0);
      if (delay) el.style.setProperty('--delay', `${delay}ms`);
    });
  });
  document.querySelectorAll('.reveal, .is-split').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

/* ── Count-ups ── */
if ('IntersectionObserver' in window && !reducedMotion) {
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const start = performance.now();
      const dur = 1600;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => {
    if (parseInt(el.dataset.count, 10) > 1) { el.textContent = '0'; countObserver.observe(el); }
  });
}

/* ── Hero reel: the like counter ticks up ── */
const ticker = document.querySelector('[data-ticker]');
if (ticker && !reducedMotion) {
  let likes = 2400;
  setInterval(() => {
    likes += Math.floor(Math.random() * 9) + 1;
    ticker.textContent = (likes / 1000).toFixed(1) + 'k';
  }, 1400);
}

/* ── Hero reel: photos play like Instagram stories (5s each, looping) ── */
const storySlides = [...document.querySelectorAll('.reel__slides img')];
const storyBars   = [...document.querySelectorAll('.reel__progress span')];
if (storySlides.length && !reducedMotion) {
  const STORY_MS = 5000;
  let current = 0;
  const show = i => {
    storySlides.forEach((img, n) => img.classList.toggle('is-active', n === i));
    storyBars.forEach((bar, n) => {
      bar.classList.remove('is-active');
      bar.classList.toggle('is-done', n < i);
    });
    void storyBars[i].offsetWidth; // restart the bar's fill animation
    storyBars[i].classList.add('is-active');
  };
  // Photos 2–6 load after the page has finished loading, so they don't slow it down
  const loadRest = () => storySlides.forEach(img => { if (img.dataset.src) img.src = img.dataset.src; });
  if (document.readyState === 'complete') loadRest(); else window.addEventListener('load', loadRest);

  show(0);
  setInterval(() => {
    if (document.hidden) return;
    const next = (current + 1) % storySlides.length;
    if (!storySlides[next].complete || !storySlides[next].naturalWidth) return; // wait for the photo
    current = next;
    show(current);
  }, STORY_MS);
}

/* ── Marketing phones: Chad's reels play while the section is on screen ──
   Phones in Low Power / Data Saver mode refuse to autoplay, and with reduced
   motion we don't autoplay; in both cases a tap (on a phone, or anywhere on the
   page for blocked autoplay) starts them, since browsers allow play after a tap. */
const reelVideos = [...document.querySelectorAll('.mini-screen__video')];
const reelBox    = document.querySelector('.marketing__phones');
if (reelVideos.length && reelBox) {
  let onScreen = false;
  const load = v => { if (!v.src) { v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = v.dataset.src; } };
  const playAll = () => reelVideos.forEach(v => { load(v); v.play().catch(waitForTap); });
  const pauseAll = () => reelVideos.forEach(v => v.pause());
  function waitForTap() {
    ['touchend', 'click'].forEach(type => document.addEventListener(type, () => { if (onScreen) playAll(); }, { once: true, passive: true }));
  }

  reelVideos.forEach(v => {
    const bar = v.parentElement.querySelector('.mini-screen__bar');
    v.addEventListener('timeupdate', () => {
      if (bar && v.duration) bar.style.setProperty('--progress', (v.currentTime / v.duration).toFixed(3));
    });
  });
  // Tapping a phone always plays its reel (or pauses it if it's playing)
  reelBox.addEventListener('click', e => {
    const screen = e.target.closest('.phone__screen');
    const v = screen && screen.querySelector('.mini-screen__video');
    if (!v) return;
    load(v);
    if (v.paused) v.play().catch(() => {}); else v.pause();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      onScreen = entries[entries.length - 1].isIntersecting;
      if (onScreen && !reducedMotion) playAll();
      else if (!onScreen) pauseAll();
    }, { rootMargin: '200px 0px' }).observe(reelBox);
  }
}

/* ── Scroll-driven effects (one rAF loop) ── */
const parallaxEls = [...document.querySelectorAll('[data-parallax-x]')];
const floatPhones = [...document.querySelectorAll('[data-float]')];
const floatBase   = [-8, 0, 8];
const processList = document.querySelector('.process__list');
const processLine = document.querySelector('.process__line');
const steps       = [...document.querySelectorAll('.step')];
let ticking = false;

function onScroll() {
  const y  = window.scrollY;
  const vh = window.innerHeight;

  // Progress bar
  const total = document.documentElement.scrollHeight - vh;
  progressBar.style.transform = `scaleX(${total > 0 ? y / total : 0})`;

  // Nav state
  if (nav) {
    nav.classList.toggle('scrolled', y > 20);
    const menuOpen = navLinks && navLinks.classList.contains('open');
    nav.classList.toggle('hide', !menuOpen && y > lastY && y > vh * 0.8);
  }
  lastY = y;

  // Active nav link
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (y >= top && y < top + section.offsetHeight) {
      navAnchors.forEach(a => a.classList.toggle('active', a.hash === `#${section.id}`));
    }
  });

  if (!reducedMotion) {
    // Horizontal parallax words
    parallaxEls.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const speed = parseFloat(el.dataset.parallaxX);
      el.style.transform = `translate3d(${(vh - r.top) * speed}px,0,0)`;
    });

    // Marketing phones drift at different speeds
    if (window.innerWidth > 600) floatPhones.forEach(phone => {
      const i = parseInt(phone.dataset.float, 10);
      const r = phone.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const shift = (r.top + r.height / 2 - vh / 2) * [0.12, -0.08, 0.16][i];
      phone.style.transform = `translate3d(0,${shift}px,0) rotate(${floatBase[i]}deg)`;
    });

    // Statement words light up
    if (statementWords.length) {
      const r = statement.getBoundingClientRect();
      const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      const lit = Math.round(p * statementWords.length);
      statementWords.forEach((w, i) => w.classList.toggle('on', i < lit));
    }
  }

  // Process line fills, steps light as the line reaches them
  if (processList && processLine) {
    const r = processList.getBoundingClientRect();
    const mark = vh * 0.6;
    const p = Math.min(Math.max((mark - r.top) / r.height, 0), 1);
    processLine.style.setProperty('--progress', p);
    steps.forEach(step => {
      step.classList.toggle('lit', step.getBoundingClientRect().top + 32 < mark);
    });
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();

/* ── Pointer effects (desktop only) ── */
if (finePointer && !reducedMotion) {
  // Magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // Hero phone tilts toward the cursor
  const hero = document.querySelector('.hero');
  const tilt = document.querySelector('[data-tilt]');
  if (hero && tilt) {
    hero.addEventListener('mousemove', e => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      tilt.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
    });
    hero.addEventListener('mouseleave', () => { tilt.style.transform = ''; });
  }

  // Spotlight follows the cursor on cards
  document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ── Sticky valuation CTAs: hidden over the hero and the valuation section ── */
if ('IntersectionObserver' in window) {
  const ctas = document.querySelectorAll('.cta-sticky-desktop, .cta-sticky-mobile');
  const watch = [document.querySelector('.hero'), document.querySelector('#valuation'), document.querySelector('.footer')].filter(Boolean);
  const visible = new Set();
  const ctaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    ctas.forEach(c => c.classList.toggle('hidden', visible.size > 0));
  }, { threshold: 0.05 });
  watch.forEach(el => ctaObserver.observe(el));
}

/* ── Valuation form: opens WhatsApp with the details filled in ── */
const form = document.getElementById('valuationForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const required = [...form.querySelectorAll('[required]')];
    const missing  = required.filter(f => !f.value.trim());
    required.forEach(f => f.setAttribute('aria-invalid', missing.includes(f) ? 'true' : 'false'));
    if (missing.length) { missing[0].focus(); return; }

    const data = new FormData(form);
    const lines = [
      `Hi Chad, I'd like a free valuation.`,
      ``,
      `Name: ${data.get('name').trim()}`,
      `Phone: ${data.get('phone').trim()}`,
      `Property: ${data.get('type')} in ${data.get('area').trim()}`,
      `Timing: ${data.get('when')}`,
    ];
    const msg = (data.get('message') || '').trim();
    if (msg) lines.push(`Notes: ${msg}`);

    // Save the lead to the Google Sheet. sendBeacon carries on even as WhatsApp
    // opens, and a plain-text body avoids a CORS preflight Apps Script can't answer.
    if (LEADS_URL) {
      const lead = JSON.stringify({
        name: data.get('name').trim(), phone: data.get('phone').trim(), area: data.get('area').trim(),
        type: data.get('type'), when: data.get('when'), message: msg,
        website: data.get('website') || '', source: location.hostname,
      });
      const blob = new Blob([lead], { type: 'text/plain;charset=UTF-8' });
      if (!(navigator.sendBeacon && navigator.sendBeacon(LEADS_URL, blob))) {
        fetch(LEADS_URL, { method: 'POST', mode: 'no-cors', keepalive: true, body: blob }).catch(() => {});
      }
    }

    // For Google Tag Manager. Name, phone, address and notes are left out on
    // purpose: Google's terms forbid sending personal information to Analytics/Ads.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'valuation_form_submit',
      form_id: 'valuation',
      contact_method: 'whatsapp',
      property_type: data.get('type'),
      selling_timeline: data.get('when'),
      has_notes: Boolean(msg),
    });

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
}
