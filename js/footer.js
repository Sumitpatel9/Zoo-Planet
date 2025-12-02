// js/footer.js
(function () {
  // fill current year
  const yEl = document.getElementById('footer-year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // dynamically set body padding-bottom to footer actual height (prevents overlap if footer height changes)
  function adjustBodyPaddingForFooter() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    const rect = footer.getBoundingClientRect();
    const h = Math.ceil(rect.height);
    // Keep a small extra gap
    document.body.style.paddingBottom = (h + 24) + 'px';
  }

  // adjust on load and resize
  window.addEventListener('load', adjustBodyPaddingForFooter);
  window.addEventListener('resize', adjustBodyPaddingForFooter);
  // Also run a short-time polling to handle fonts/images loading that affect size
  setTimeout(adjustBodyPaddingForFooter, 600);
})();

fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });

