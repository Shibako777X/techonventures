document.documentElement.classList.add('js');
if (window.lucide) lucide.createIcons();

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (v, a, b) => clamp((v - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const vh = () => window.innerHeight;
const isPhone = matchMedia('(max-width: 809px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

// Wrap each word in span.w, keeping nested spans and <br>.
function splitWords(root) {
  const words = [];
  (function walk(node) {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(part));
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          frag.appendChild(s);
          words.push(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  })(root);
  return words;
}

/* ---------- Nav ---------- */
const nav = $('.nav');
const navCta = $('.nav-cta');
$('.nav-burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
$$('.mobile-menu a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

/* ---------- Hero ---------- */
const heroWrap = $('.hero-wrap');
const heroSticky = $('.hero-sticky');
const heroWords = splitWords($('.statement h2'));

function updateHero() {
  const total = heroWrap.offsetHeight - vh();
  const p = clamp(-heroWrap.getBoundingClientRect().top / total);
  const inset = isPhone.matches ? 10 : 20;
  const radius = isPhone.matches ? 30 : 40;
  const a = easeOut(range(p, 0, 0.16));
  const s = heroSticky.style;
  s.setProperty('--hi', `${inset * (1 - a)}px`);
  s.setProperty('--hr', `${radius * (1 - a)}px`);
  s.setProperty('--ho', 1 - range(p, 0, 0.1));
  s.setProperty('--hb', range(p, 0.06, 0.3) * 28);
  s.setProperty('--hs', range(p, 0.06, 0.3) * 0.35);
  s.setProperty('--so', range(p, 0.12, 0.24));
  const n = range(p, 0.24, 0.82) * heroWords.length;
  heroWords.forEach((w, i) => w.classList.toggle('on', i < n));
}

/* ---------- Before / After ---------- */
const track = $('.compare-track');
const before = $('.cmp-before');
const after = $('.cmp-after');

function updateCompare() {
  if (isPhone.matches) {
    [before, after].forEach((el) => el.removeAttribute('style'));
    return;
  }
  const r = track.getBoundingClientRect();
  const enter = easeOut(range(vh() - r.top, 0, vh()));
  const p = clamp(-r.top / (track.offsetHeight - vh()));
  const q = easeInOut(range(p, 0.12, 0.72));
  const half = (before.offsetWidth + 20) / 2;
  const scale = 0.86 + 0.14 * enter;
  before.style.setProperty('--cs', scale);
  after.style.setProperty('--cs', scale);
  before.style.setProperty('--bx', `${half * (1 - q)}px`);
  after.style.setProperty('--ax', `${-half * (1 - q)}px`);
  after.style.setProperty('--ao', range(q, 0, 0.12));
  before.style.setProperty('--bo', 1 - 0.45 * Math.max(1 - enter, q));
}

/* ---------- Word-by-word headings ---------- */
const revealSets = $$('.reveal-words').map((el) => ({ el, words: splitWords(el) }));

function updateReveal() {
  revealSets.forEach(({ el, words }) => {
    const p = range(vh() * 0.92 - el.getBoundingClientRect().top, 0, vh() * 0.42);
    const n = p * words.length;
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  });
}

/* ---------- Stacked service cards ---------- */
const cards = $$('.svc');

function updateStack() {
  cards.forEach((c, i) => {
    const next = cards[i + 1];
    if (!next) return;
    const top = parseFloat(getComputedStyle(c).top) || 0;
    const t = range(vh() - next.getBoundingClientRect().top, 0, vh() - top);
    c.style.transform = t > 0 ? `scale(${1 - t * 0.05})` : '';
  });
}

/* ---------- Footer reveal ---------- */
const footer = $('.footer');

function updateFooter() {
  const r = footer.getBoundingClientRect();
  const p = range(vh() - r.top, 0, Math.min(footer.offsetHeight, vh()));
  footer.style.setProperty('--fp', easeOut(p).toFixed(4));
}

/* ---------- Scroll loop ---------- */
let ticking = false;
function update() {
  ticking = false;
  nav.classList.toggle('is-scrolled', scrollY > 40);
  navCta.classList.toggle('is-hidden', scrollY > 120);
  updateHero();
  updateCompare();
  updateReveal();
  updateStack();
  updateFooter();
}
function requestUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}
addEventListener('scroll', requestUpdate, { passive: true });
addEventListener('resize', requestUpdate);
update();

/* ---------- Entrance + counters ---------- */
function countUp(el) {
  const end = parseFloat(el.dataset.count);
  const dec = +el.dataset.dec || 0;
  if (reduced) return (el.textContent = end.toFixed(dec));
  const t0 = performance.now();
  (function frame(t) {
    const k = clamp((t - t0) / 1800);
    el.textContent = (end * easeOut(k)).toFixed(dec);
    if (k < 1) requestAnimationFrame(frame);
  })(t0);
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      if (e.target.matches('.plan-detail') && !priceShown) {
        priceShown = true;
        setPrice(PLANS[activePlan].price);
      }
      io.unobserve(e.target);
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
$$('[data-anim], .chart').forEach((el) => io.observe(el));

/* ---------- Process phases ---------- */
const phases = $$('.phase');
let phase = 0;
let phaseTimer;

function setPhase(i) {
  phase = i;
  phases.forEach((p, j) => {
    p.classList.toggle('is-active', j === i);
    $$('.phase-dots i', p).forEach((d, k) => d.classList.toggle('on', k === i));
  });
}
function startPhases() {
  clearInterval(phaseTimer);
  phaseTimer = setInterval(() => setPhase((phase + 1) % phases.length), 5000);
}
phases.forEach((p, i) => p.addEventListener('click', () => { setPhase(i); startPhases(); }));
$('.phases').addEventListener('mouseenter', () => clearInterval(phaseTimer));
$('.phases').addEventListener('mouseleave', startPhases);
setPhase(0);
startPhases();

/* ---------- Video modal ---------- */
const modal = $('.video-modal');
const closeModal = () => modal.classList.remove('open');
$('.play').addEventListener('click', () => modal.classList.add('open'));
$('.video-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => e.target === modal && closeModal());
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    document.body.classList.remove('menu-open');
  }
});

/* ---------- Team ---------- */
$$('.member-row').forEach((row) =>
  row.addEventListener('click', () => row.parentElement.classList.toggle('open'))
);

/* ---------- Testimonial cards ---------- */
const tcards = $$('.tcard');
tcards.forEach((card) =>
  card.addEventListener('click', () => tcards.forEach((c) => c.classList.toggle('is-open', c === card)))
);

/* ---------- Pricing ---------- */
const PLANS = [
  {
    name: 'Focus Sprint',
    tag: 'Focus Sprint',
    badge: '',
    from: 'Starts at', price: '$3,200', per: '/mo',
    desc: 'A dedicated 6-week engineering sprint to build your MVP, identify system bottlenecks, and ship fast.',
    features: ['Full architecture audit', 'Rapid prototype & core development', 'Weekly working sessions', 'Conversion improvement plan', '30-day post-launch code review'],
  },
  {
    name: 'Embedded Partner',
    tag: 'Embedded Partner',
    badge: 'Popular',
    from: 'Starts at', price: '$9,000', per: '/mo',
    desc: 'An ongoing partnership with a senior engineering team embedded directly into your product lifecycle.',
    features: ['Everything in Focus Sprint', 'Dedicated senior developers & UI/UX', 'Bi-weekly milestone reviews', 'Hands-on system builds & scaling', 'Quarterly planning sessions'],
  },
  {
    name: 'Custom Enterprise',
    tag: 'Custom',
    badge: '',
    from: 'Scoped to you', price: "Let's talk", per: '',
    desc: 'Complex multi-team architectures, custom cloud logic, and end-to-end software solutions tailored to enterprise needs.',
    features: ['Tailored scope & engineering pod', 'Advanced backend & API integrations', 'On-site or remote tech workshops', 'Board-ready technical reporting', 'Flexible terms'],
  },
];
const priceEl = $('#price');
let activePlan = 0;
let priceShown = false;

// Odometer: one 0-9 strip per digit, slid into place.
function setPrice(str) {
  if (!/\d/.test(str)) {
    priceEl.dataset.len = '';
    priceEl.innerHTML = `<span class="odo-text">${str}</span>`;
    return;
  }
  const chars = [...str];
  if (priceEl.dataset.len !== String(chars.length)) {
    const strip = [...'0123456789'].map((d) => `<span>${d}</span>`).join('');
    priceEl.innerHTML = chars
      .map((c) => (/\d/.test(c) ? `<span class="odo-col"><span class="odo-strip">${strip}</span></span>` : `<span class="odo-sym">${c}</span>`))
      .join('');
    priceEl.dataset.len = chars.length;
    priceEl.offsetWidth; // commit the 0 position so the first move animates
  }
  const strips = $$('.odo-strip', priceEl);
  let k = 0;
  chars.forEach((c) => {
    if (!/\d/.test(c)) return;
    strips[k].style.transitionDelay = `${k * 70}ms`;
    strips[k].style.transform = `translateY(-${+c * 10}%)`;
    k++;
  });
}

function renderPlan(i) {
  activePlan = i;
  const plan = PLANS[i];
  $$('.plan').forEach((b, j) => b.classList.toggle('is-active', j === i));
  $('#plan-from').textContent = plan.from;
  $('#price-per').textContent = plan.per;
  $('#plan-desc').textContent = plan.desc;
  $('#plan-features').innerHTML = plan.features
    .map((f, k) => `<li style="animation-delay:${k * 60}ms"><span class="ic">${CHECK}</span>${f}</li>`)
    .join('');
  if (priceShown) setPrice(plan.price);
}
$$('.plan').forEach((b, i) => b.addEventListener('click', () => renderPlan(i)));
renderPlan(0);
setPrice('$0000');

/* ---------- FAQ ---------- */
const FAQ = {
  general: [
    ['What does Verra actually do?', 'We help B2B companies between roughly $2M and $40M in revenue grow faster and more predictably. That means finding what is holding growth back, building the plan to fix it, and working with your team to put it in place. We focus on strategy, systems, and positioning rather than running campaigns.'],
    ['Which industries do you work with?', 'Mostly B2B: SaaS, fintech, professional services, and healthtech. What our clients share is a strong product and the need for a repeatable growth engine. Our frameworks travel well, but every engagement is tuned to your market and buyers.'],
    ['How are you different from an agency?', 'Agencies usually execute specific channels such as paid media or content. We work one step earlier: deciding where growth will come from, what to prioritise, and which systems you need. If you need an execution partner afterwards, we will help you choose one.'],
    ['Who on our team works with you?', 'Usually the founder or CEO plus whoever owns revenue. We join your existing rituals, work in your tools, and collaborate directly with the people doing the work, so it feels like adding a senior team member.'],
  ],
  pricing: [
    ['How is pricing structured?', 'Engagements are billed monthly with a clear scope. Focus Sprints are fixed-length; partnerships roll month to month after an initial quarter.'],
    ['Is there a minimum commitment?', 'Sprints run six weeks. Partnerships start with a three-month commitment so there is time to ship meaningful change, then continue monthly.'],
    ['Do you offer performance-based fees?', 'For some partnerships we tie part of the fee to agreed outcomes. We will discuss whether that model fits during the first call.'],
  ],
  process: [
    ['What happens on the first call?', 'A 30-minute conversation about where you are, what you have tried, and where you want to be. You will leave with at least one useful idea, whether or not we work together.'],
    ['How soon do we see results?', 'Most clients see early wins within the first four to six weeks, with larger structural gains compounding over the following quarters.'],
    ['How much of our time does it take?', 'Expect a weekly working session with leadership plus a few hours from the owners of each workstream. We do the heavy lifting between sessions.'],
  ],
  results: [
    ['What results do clients typically see?', 'Across recent engagements, clients saw a median 38% lift in qualified pipeline and a meaningful drop in acquisition cost within two quarters.'],
    ['How do you measure success?', 'We agree on a small set of metrics at the start, baseline them, and report against them every month so progress is never a matter of opinion.'],
    ['What if it does not work?', 'We review progress every month. If something is not moving, we change course early rather than waiting for the end of the engagement.'],
  ],
};
const faqList = $('#faq-list');

function renderFaq(tab) {
  faqList.innerHTML = FAQ[tab]
    .map(([q, a], i) => `
      <div class="faq-item${i === 0 ? ' open' : ''}" style="animation-delay:${i * 60}ms">
        <button class="faq-q" aria-expanded="${i === 0}"><span>${q}</span><span class="pm"></span></button>
        <div class="faq-a"><div><p>${a}</p></div></div>
      </div>`)
    .join('');
}
faqList.addEventListener('click', (e) => {
  const btn = e.target.closest('.faq-q');
  if (!btn) return;
  const item = btn.parentElement;
  const open = !item.classList.contains('open');
  $$('.faq-item', faqList).forEach((it) => {
    it.classList.remove('open');
    $('.faq-q', it).setAttribute('aria-expanded', 'false');
  });
  item.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
});
$$('.faq-tabs button').forEach((b) =>
  b.addEventListener('click', () => {
    $$('.faq-tabs button').forEach((x) => x.classList.toggle('is-active', x === b));
    renderFaq(b.dataset.tab);
  })
);
renderFaq('general');

/* ---------- Copy email ---------- */
$$('.copy').forEach((btn) =>
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch {
      const t = document.createElement('textarea');
      t.value = btn.dataset.copy;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    btn.classList.add('done');
    setTimeout(() => btn.classList.remove('done'), 1600);
  })
);

/* ---------- Forms (front-end only) ---------- */
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const form = $('.form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.elements.name;
  const email = form.elements.email;
  const terms = form.elements.terms;
  name.classList.toggle('invalid', !name.value.trim());
  email.classList.toggle('invalid', !emailOk(email.value));
  const msg = $('.form-msg', form);
  if (!name.value.trim() || !emailOk(email.value)) return (msg.textContent = 'Please add your name and a valid email.');
  if (!terms.checked) return (msg.textContent = 'Please accept the terms of service.');
  msg.textContent = "Thanks! We'll be in touch within one business day.";
  form.reset();
});

const sub = $('.subscribe');
sub.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('input', sub);
  const ok = emailOk(input.value);
  sub.classList.toggle('invalid', !ok);
  if (!ok) return;
  input.value = '';
  input.placeholder = 'Thanks for subscribing!';
});
