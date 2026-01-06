
/* nav.js - small script to control mobile toggle and remove back buttons */
(function() {
  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('show');
    });
    // close menu when clicking outside (mobile)
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.site-navbar')) {
        links.classList.remove('show');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Remove "back" button(s) — handles common patterns
  const backSelectors = [
    '#back', '.back-btn', '.btn-back', 'button[name="back"]', 'a.back'
  ];
  backSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.remove());
  });

  // Also remove links with text "Back" (case-insensitive) if they exist
  document.querySelectorAll('a,button').forEach(el => {
    const txt = (el.textContent || '').trim().toLowerCase();
    if (txt === 'back' || txt === 'go back') el.remove();
  });

})();

// fetch("nav.html")
//   .then(res => res.text())
//   .then(data => {
//     document.getElementById("nav-placeholder").innerHTML = data;
//   });