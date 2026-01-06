// js/faq.js - search, accordion, expand/collapse, accessibility
document.addEventListener('DOMContentLoaded', function () {
  const faqSearch = document.getElementById('faq-search');
  const clearSearch = document.getElementById('clear-search');
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  const expandAllBtn = document.getElementById('expand-all');
  const collapseAllBtn = document.getElementById('collapse-all');
  const faqList = document.querySelector('.faq-list');

  // toggle single item
  function toggleItem(item, expand) {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const shouldExpand = (typeof expand === 'boolean') ? expand : !isExpanded;

    btn.setAttribute('aria-expanded', shouldExpand);
    if (shouldExpand) panel.hidden = false;
    else panel.hidden = true;
  }

  // initialize: ensure all panels hidden
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    btn.setAttribute('aria-expanded', 'false');
    panel.hidden = true;

    // click handler
    btn.addEventListener('click', () => toggleItem(item));
    // keyboard accessibility (Enter / Space)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(item);
      }
    });
  });

  // Expand / Collapse all
  expandAllBtn && expandAllBtn.addEventListener('click', () => {
    faqItems.forEach(it => toggleItem(it, true));
  });
  collapseAllBtn && collapseAllBtn.addEventListener('click', () => {
    faqItems.forEach(it => toggleItem(it, false));
  });

  // Search / Filter
  function normalize(s) { return (s||'').toString().toLowerCase(); }

  function doSearch(query) {
    query = normalize(query).trim();
    let anyVisible = false;

    faqItems.forEach(item => {
      const qText = normalize(item.querySelector('.faq-q span').textContent);
      const aText = normalize(item.querySelector('.faq-a').textContent);
      const tags = normalize(item.dataset.tags || '');
      const matches = !query || qText.includes(query) || aText.includes(query) || tags.includes(query);

      // highlight matched substring in question (simple)
      const qSpan = item.querySelector('.faq-q span');
      const originalQ = qSpan.textContent;
      if (query && qText.includes(query)) {
        const idx = qText.indexOf(query);
        // naive highlight (case-insensitive)
        const before = originalQ.slice(0, idx);
        const match = originalQ.slice(idx, idx + query.length);
        const after = originalQ.slice(idx + query.length);
        qSpan.innerHTML = `${escapeHtml(before)}<span class="faq-highlight">${escapeHtml(match)}</span>${escapeHtml(after)}`;
      } else {
        qSpan.textContent = originalQ;
      }

      item.style.display = matches ? '' : 'none';
      if (matches) anyVisible = true;
    });

    // show no-results message
    let noEl = document.querySelector('.faq-no-results');
    if (!anyVisible) {
      if (!noEl) {
        noEl = document.createElement('div');
        noEl.className = 'faq-no-results';
        noEl.textContent = 'No FAQs match your search. Try different keywords.';
        faqList.appendChild(noEl);
      }
    } else {
      if (noEl) noEl.remove();
    }
  }

  // simple escape for inserted HTML
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (m) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]; });
  }

  faqSearch && faqSearch.addEventListener('input', (e) => doSearch(e.target.value));
  clearSearch && clearSearch.addEventListener('click', () => {
    if (faqSearch) {
      faqSearch.value = '';
      faqSearch.focus();
      doSearch('');
    }
  });

  // keyboard: press "/" to focus search (like many sites)
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      faqSearch && faqSearch.focus();
    }
  });
});
