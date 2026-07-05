document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const formatNum = (n) => n >= 1000 ? (n % 1000 === 0 ? (n/1000)+'K' : (n/1000).toFixed(1)+'K') : String(n);

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const isFloat = String(target).includes('.') || el.dataset.float === 'true';
    if (reduce) { el.textContent = pre + (isFloat ? target : formatNum(target)) + suf; return; }
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = pre + (isFloat ? val.toFixed(1) : formatNum(Math.round(val))) + suf;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = pre + (isFloat ? target : formatNum(target)) + suf;
    };
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      e.target.querySelectorAll?.('[data-count]').forEach(countUp);
      if (e.target.matches?.('[data-count]')) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  if (reduce) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('[data-count]').forEach(countUp);
  } else {
    document.querySelectorAll('.reveal, [data-count]').forEach(el => io.observe(el));
  }

  const toggle = document.querySelector('[data-nav-toggle]');
  if (toggle) toggle.addEventListener('click', () => document.querySelector('[data-nav]')?.classList.toggle('open'));
});
