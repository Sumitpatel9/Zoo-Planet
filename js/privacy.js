// js/privacy.js — small interactions: print, accept checkbox and cookie banner
document.addEventListener('DOMContentLoaded', function () {
  const printBtn = document.getElementById('printPolicy');
  const acceptChk = document.getElementById('acceptPrivacy');
  const continueBtn = document.getElementById('continuePrivacy');

  // print/save
  printBtn && printBtn.addEventListener('click', function () {
    window.print();
  });

  // accept checkbox enables continue
  if (acceptChk && continueBtn) {
    acceptChk.addEventListener('change', function () {
      continueBtn.disabled = !this.checked;
    });
    continueBtn.addEventListener('click', function () {
      // default action: go back to home or proceed to booking
      window.location.href = 'index.html';
    });
  }

  // smooth scrolling for TOC links
  document.querySelectorAll('.privacy-toc a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    });
  });

  // Cookie consent: show only if not previously accepted
  const cookieKey = 'zp_cookies_accepted_v1';
  const cookieBanner = document.getElementById('cookie-consent');
  const acceptCookies = document.getElementById('acceptCookies');
  const manageCookies = document.getElementById('manageCookies');

  function showCookieBanner() {
    if (!localStorage.getItem(cookieKey)) {
      cookieBanner && cookieBanner.setAttribute('aria-hidden', 'false');
      if (cookieBanner) cookieBanner.style.display = 'block';
    }
  }

  function hideCookieBanner() {
    if (cookieBanner) {
      cookieBanner.setAttribute('aria-hidden', 'true');
      cookieBanner.style.display = 'none';
    }
  }

  acceptCookies && acceptCookies.addEventListener('click', function () {
    localStorage.setItem(cookieKey, '1');
    hideCookieBanner();
    // optionally initialize analytics here
  });

  manageCookies && manageCookies.addEventListener('click', function () {
    // optional: open cookie preferences modal or show instructions
    alert('Manage cookies via your browser settings. (This demo has no granular UI.)');
  });

  showCookieBanner();
});
