// js/terms.js — small interactions: print, enable continue after accept, smooth scroll highlight
document.addEventListener('DOMContentLoaded', function () {
  const printBtn = document.getElementById('printTerms');
  const acceptChk = document.getElementById('acceptTerms');
  const continueBtn = document.getElementById('continueBtn');
  const tocLinks = document.querySelectorAll('.terms-toc nav a');

  // print/save
  printBtn && printBtn.addEventListener('click', function () {
    window.print();
  });

  // enable continue when checkbox is checked
  if (acceptChk && continueBtn) {
    acceptChk.addEventListener('change', function () {
      continueBtn.disabled = !this.checked;
    });

    continueBtn.addEventListener('click', function () {
      // proceed to homepage or booking depending on flow
      window.location.href = 'index.html';
    });
  }

  // smooth scroll and highlight TOC link
  tocLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update URL hash without jump
        history.replaceState(null, '', '#' + id);
      }
    });
  });

  // optional: highlight current section in TOC while scrolling
  const sections = Array.from(document.querySelectorAll('.terms-content > article'));
  function highlightToc() {
    const offset = 120; // adjust for sticky nav
    let activeId = null;
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top - offset <= 0) activeId = s.id;
    }
    tocLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === ('#' + activeId));
    });
  }
  window.addEventListener('scroll', highlightToc, { passive: true });
  highlightToc();
});
