const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (value, start, end) => clamp((value - start) / (end - start));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

const PLANS = [
  { from: 'Starts at', price: '$3,200', per: '/mo', desc: 'A dedicated 6-week engineering sprint to build your MVP, identify system bottlenecks, and ship fast.', features: ['Full architecture audit', 'Rapid prototype & core development', 'Weekly working sessions', 'Conversion improvement plan', '30-day post-launch code review'] },
  { from: 'Starts at', price: '$9,000', per: '/mo', desc: 'An ongoing partnership with a senior engineering team embedded directly into your product lifecycle.', features: ['Everything in Focus Sprint', 'Dedicated senior developers & UI/UX', 'Bi-weekly milestone reviews', 'Hands-on system builds & scaling', 'Quarterly planning sessions'] },
  { from: 'Scoped to you', price: "Let's talk", per: '', desc: 'Complex multi-team architectures, custom cloud logic, and end-to-end software solutions tailored to enterprise needs.', features: ['Tailored scope & engineering pod', 'Advanced backend & API integrations', 'On-site or remote tech workshops', 'Board-ready technical reporting', 'Flexible terms'] },
];
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

function splitWords(root) {
  const existingWords = root.querySelectorAll('.w');
  if (existingWords.length) return [...existingWords];

  const words = [];
  (function walk(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) fragment.appendChild(document.createTextNode(part));
          else {
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            fragment.appendChild(span);
            words.push(span);
          }
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') walk(child);
    });
  })(root);
  return words;
}

// Ported from script.js; event wiring is scoped to the rendered page and fully cleaned up.
export function initializeOriginalPage(root) {
  if (!root) return () => {};
  let active = true;
  const cleanups = [];
  const timeoutIds = new Set();
  const countFrames = new Set();
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };
  const $ = (selector, scope = root) => scope.querySelector(selector);
  const $$ = (selector, scope = root) => [...scope.querySelectorAll(selector)];
  const viewportHeight = () => window.innerHeight;
  const isPhone = matchMedia('(max-width: 809px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = $('.nav');
  const navCta = $('.nav-cta');
  const heroWrap = $('.hero-wrap');
  const heroSticky = $('.hero-sticky');
  const heroWords = splitWords($('.statement h2'));
  const track = $('.compare-track');
  const before = $('.cmp-before');
  const after = $('.cmp-after');
  const revealSets = $$('.reveal-words').map((element) => ({ element, words: splitWords(element) }));
  const cards = $$('.svc');
  const footer = $('.footer');
  const phases = $$('.phase');
  const modal = $('.video-modal');
  const testimonialCards = $$('.tcard');
  const priceEl = $('#price');
  const faqList = $('#faq-list');
  const form = $('.form');
  const subscribe = $('.subscribe');
  let ticking = false;
  let updateFrame = 0;
  let phase = 0;
  let phaseTimer;
  let activePlan = 0;
  let priceShown = false;

  const updateHero = () => {
    const total = heroWrap.offsetHeight - viewportHeight();
    const progress = clamp(-heroWrap.getBoundingClientRect().top / total);
    const inset = isPhone.matches ? 10 : 20;
    const radius = isPhone.matches ? 30 : 40;
    const amount = easeOut(range(progress, 0, 0.16));
    const style = heroSticky.style;
    style.setProperty('--hi', `${inset * (1 - amount)}px`);
    style.setProperty('--hr', `${radius * (1 - amount)}px`);
    style.setProperty('--ho', 1 - range(progress, 0, 0.1));
    style.setProperty('--hb', range(progress, 0.06, 0.3) * 28);
    style.setProperty('--hs', range(progress, 0.06, 0.3) * 0.35);
    style.setProperty('--so', range(progress, 0.12, 0.24));
    const count = range(progress, 0.24, 0.82) * heroWords.length;
    heroWords.forEach((word, index) => word.classList.toggle('on', index < count));
  };

  const updateCompare = () => {
    if (isPhone.matches) {
      [before, after].forEach((element) => element.removeAttribute('style'));
      return;
    }
    const rect = track.getBoundingClientRect();
    const enter = easeOut(range(viewportHeight() - rect.top, 0, viewportHeight()));
    const progress = clamp(-rect.top / (track.offsetHeight - viewportHeight()));
    const mix = easeInOut(range(progress, 0.12, 0.72));
    const half = (before.offsetWidth + 20) / 2;
    const scale = 0.86 + 0.14 * enter;
    before.style.setProperty('--cs', scale);
    after.style.setProperty('--cs', scale);
    before.style.setProperty('--bx', `${half * (1 - mix)}px`);
    after.style.setProperty('--ax', `${-half * (1 - mix)}px`);
    after.style.setProperty('--ao', range(mix, 0, 0.12));
    before.style.setProperty('--bo', 1 - 0.45 * Math.max(1 - enter, mix));
  };

  const updateReveal = () => revealSets.forEach(({ element, words }) => {
    const progress = range(viewportHeight() * 0.92 - element.getBoundingClientRect().top, 0, viewportHeight() * 0.42);
    const count = progress * words.length;
    words.forEach((word, index) => word.classList.toggle('on', index < count));
  });

  const updateStack = () => cards.forEach((card, index) => {
    const next = cards[index + 1];
    if (!next) return;
    const top = parseFloat(getComputedStyle(card).top) || 0;
    const amount = range(viewportHeight() - next.getBoundingClientRect().top, 0, viewportHeight() - top);
    card.style.transform = amount > 0 ? `scale(${1 - amount * 0.05})` : '';
  });

  const updateFooter = () => {
    const rect = footer.getBoundingClientRect();
    const progress = range(viewportHeight() - rect.top, 0, Math.min(footer.offsetHeight, viewportHeight()));
    footer.style.setProperty('--fp', easeOut(progress).toFixed(4));
  };

  const update = () => {
    ticking = false;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
    navCta.classList.toggle('is-hidden', window.scrollY > 120);
    updateHero();
    updateCompare();
    updateReveal();
    updateStack();
    updateFooter();
  };
  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      updateFrame = requestAnimationFrame(update);
    }
  };
  listen(window, 'scroll', requestUpdate, { passive: true });
  listen(window, 'resize', requestUpdate);
  listen(window, 'load', requestUpdate);
  document.fonts?.ready.then(() => {
    if (active) requestUpdate();
  });
  update();

  const countUp = (element) => {
    const end = parseFloat(element.dataset.count);
    const decimals = +element.dataset.dec || 0;
    if (reduced) {
      element.textContent = end.toFixed(decimals);
      return;
    }
    const startedAt = performance.now();
    const frame = (time) => {
      const progress = clamp((time - startedAt) / 1800);
      element.textContent = (end * easeOut(progress)).toFixed(decimals);
      if (progress < 1) {
        const frameId = requestAnimationFrame(frame);
        countFrames.add(frameId);
      }
    };
    const frameId = requestAnimationFrame(frame);
    countFrames.add(frameId);
  };

  let setPrice;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      $$('[data-count]', entry.target).forEach(countUp);
      if (entry.target.matches('.plan-detail') && !priceShown) {
        priceShown = true;
        setPrice(PLANS[activePlan].price);
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('[data-anim], .chart').forEach((element) => observer.observe(element));

  const setPhase = (index) => {
    phase = index;
    phases.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === index);
      $$('.phase-dots i', item).forEach((dot, dotIndex) => dot.classList.toggle('on', dotIndex === index));
    });
  };
  const startPhases = () => {
    clearInterval(phaseTimer);
    phaseTimer = setInterval(() => setPhase((phase + 1) % phases.length), 5000);
  };
  phases.forEach((item, index) => listen(item, 'click', () => { setPhase(index); startPhases(); }));
  listen($('.phases'), 'mouseenter', () => clearInterval(phaseTimer));
  listen($('.phases'), 'mouseleave', startPhases);
  setPhase(0);
  startPhases();

  const closeModal = () => modal.classList.remove('open');
  listen($('.play'), 'click', () => modal.classList.add('open'));
  listen($('.video-close'), 'click', closeModal);
  listen(modal, 'click', (event) => { if (event.target === modal) closeModal(); });
  listen(window, 'keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      document.body.classList.remove('menu-open');
    }
  });
  listen($('.nav-burger'), 'click', () => document.body.classList.toggle('menu-open'));
  $$('.mobile-menu a').forEach((link) => listen(link, 'click', () => document.body.classList.remove('menu-open')));
  $$('.member-row').forEach((row) => listen(row, 'click', () => row.parentElement.classList.toggle('open')));
  testimonialCards.forEach((card) => listen(card, 'click', () => testimonialCards.forEach((item) => item.classList.toggle('is-open', item === card))));

  setPrice = (price) => {
    if (!/\d/.test(price)) {
      priceEl.dataset.len = '';
      priceEl.innerHTML = `<span class="odo-text">${price}</span>`;
      return;
    }
    const characters = [...price];
    if (priceEl.dataset.len !== String(characters.length)) {
      const strip = [...'0123456789'].map((digit) => `<span>${digit}</span>`).join('');
      priceEl.innerHTML = characters.map((character) => (/\d/.test(character)
        ? `<span class="odo-col"><span class="odo-strip">${strip}</span></span>`
        : `<span class="odo-sym">${character}</span>`)).join('');
      priceEl.dataset.len = characters.length;
      priceEl.offsetWidth;
    }
    const strips = $$('.odo-strip', priceEl);
    let index = 0;
    characters.forEach((character) => {
      if (!/\d/.test(character)) return;
      strips[index].style.transitionDelay = `${index * 70}ms`;
      strips[index].style.transform = `translateY(-${+character * 10}%)`;
      index++;
    });
  };
  const renderPlan = (index) => {
    activePlan = index;
    const plan = PLANS[index];
    $$('.plan').forEach((button, buttonIndex) => button.classList.toggle('is-active', buttonIndex === index));
    $('#plan-from').textContent = plan.from;
    $('#price-per').textContent = plan.per;
    $('#plan-desc').textContent = plan.desc;
    $('#plan-features').innerHTML = plan.features.map((feature, featureIndex) => `<li style="animation-delay:${featureIndex * 60}ms"><span class="ic">${CHECK}</span>${feature}</li>`).join('');
    if (priceShown) setPrice(plan.price);
  };
  $$('.plan').forEach((button, index) => listen(button, 'click', () => renderPlan(index)));
  renderPlan(0);
  setPrice('$0000');

  const renderFaq = (tab) => {
    faqList.innerHTML = FAQ[tab].map(([question, answer], index) => `
      <div class="faq-item${index === 0 ? ' open' : ''}" style="animation-delay:${index * 60}ms">
        <button class="faq-q" aria-expanded="${index === 0}"><span>${question}</span><span class="pm"></span></button>
        <div class="faq-a"><div><p>${answer}</p></div></div>
      </div>`).join('');
  };
  listen(faqList, 'click', (event) => {
    const button = event.target.closest('.faq-q');
    if (!button) return;
    const item = button.parentElement;
    const open = !item.classList.contains('open');
    $$('.faq-item', faqList).forEach((faqItem) => {
      faqItem.classList.remove('open');
      $('.faq-q', faqItem).setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
  });
  $$('.faq-tabs button').forEach((button) => listen(button, 'click', () => {
    $$('.faq-tabs button').forEach((tabButton) => tabButton.classList.toggle('is-active', tabButton === button));
    renderFaq(button.dataset.tab);
  }));
  renderFaq('general');

  $$('.copy').forEach((button) => listen(button, 'click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = button.dataset.copy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    button.classList.add('done');
    const timeoutId = setTimeout(() => {
      button.classList.remove('done');
      timeoutIds.delete(timeoutId);
    }, 1600);
    timeoutIds.add(timeoutId);
  }));

  const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  listen(form, 'submit', (event) => {
    event.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const terms = form.elements.terms;
    name.classList.toggle('invalid', !name.value.trim());
    email.classList.toggle('invalid', !emailOk(email.value));
    const message = $('.form-msg', form);
    if (!name.value.trim() || !emailOk(email.value)) return (message.textContent = 'Please add your name and a valid email.');
    if (!terms.checked) return (message.textContent = 'Please accept the terms of service.');
    message.textContent = "Thanks! We'll be in touch within one business day.";
    form.reset();
  });
  listen(subscribe, 'submit', (event) => {
    event.preventDefault();
    const input = $('input', subscribe);
    const valid = emailOk(input.value);
    subscribe.classList.toggle('invalid', !valid);
    if (!valid) return;
    input.value = '';
    input.placeholder = 'Thanks for subscribing!';
  });

  return () => {
    active = false;
    cleanups.forEach((cleanup) => cleanup());
    observer.disconnect();
    clearInterval(phaseTimer);
    timeoutIds.forEach(clearTimeout);
    if (updateFrame) cancelAnimationFrame(updateFrame);
    countFrames.forEach(cancelAnimationFrame);
    document.body.classList.remove('menu-open');
  };
}
