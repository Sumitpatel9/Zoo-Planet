// js/about.js
document.addEventListener('DOMContentLoaded', function () {
  // Animated counters
  const counters = document.querySelectorAll('.stat-num');
  const speed = 1200; // duration in ms

  function animateCounter(el) {
    const target = +el.dataset.target;
    let start = 0;
    const stepTime = Math.max(Math.floor(speed / target), 20);
    const timer = setInterval(() => {
      start += Math.ceil(target / (speed / stepTime));
      if (start >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = start.toLocaleString();
      }
    }, stepTime);
  }

  // Trigger when in view
  function onScroll() {
    counters.forEach(c => {
      const rect = c.getBoundingClientRect();
      if (rect.top < window.innerHeight && !c.dataset.animated) {
        animateCounter(c);
        c.dataset.animated = 'true';
      }
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll);

  // Team photo modal
  const modal = document.getElementById('team-modal');
  const modalImg = document.getElementById('team-modal-img');
  const modalCaption = document.getElementById('team-modal-caption');
  const closeBtn = modal && modal.querySelector('.close-modal');

  document.querySelectorAll('.team-photo').forEach(btn => {
    btn.addEventListener('click', () => {
      const full = btn.dataset.full || btn.querySelector('img').src;
      const alt = btn.querySelector('img').alt || '';
      if (modal && modalImg) {
        modalImg.src = full;
        modalCaption.textContent = alt;
        modal.setAttribute('aria-hidden','false');
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal && modal.setAttribute('aria-hidden','true'));
  window.addEventListener('click', (e) => { if (e.target === modal) modal.setAttribute('aria-hidden','true'); });

  // smooth anchor links (optional)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const t = document.getElementById(targetId);
      if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });
});
