// js/volunteer.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('volunteerForm');
  const clearBtn = document.getElementById('clearBtn');

  // file inputs and previews
  const resumeInput = document.getElementById('v-resume');
  const resumePreview = document.getElementById('resume-preview');
  const photoInput = document.getElementById('v-photo');
  const photoPreview = document.getElementById('photo-preview');

  function showFilePreview(file, container) {
    container.innerHTML = '';
    if (!file) return;
    const name = document.createElement('div');
    name.textContent = file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
    container.appendChild(name);

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.alt = 'Preview';
      img.className = 'preview-img';
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      container.appendChild(img);
    }
  }

  resumeInput && resumeInput.addEventListener('change', function (e) {
    showFilePreview(e.target.files[0], resumePreview);
  });

  photoInput && photoInput.addEventListener('change', function (e) {
    showFilePreview(e.target.files[0], photoPreview);
  });

  // simple validators
  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function validatePhone(v) {
    // loose validation: digits and spaces, + allowed, length 7-18
    return /^[+\d][\d\s-]{6,18}$/.test(v);
  }

  function clearErrors() {
    ['err-name','err-age','err-email','err-phone','err-role'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    const name = document.getElementById('v-name').value.trim();
    const age = document.getElementById('v-age').value.trim();
    const email = document.getElementById('v-email').value.trim();
    const phone = document.getElementById('v-phone').value.trim();
    const role = document.getElementById('v-role').value;

    let ok = true;
    if (!name) { document.getElementById('err-name').textContent = 'Please enter your full name.'; ok = false; }
    if (age && (isNaN(age) || Number(age) < 14)) { document.getElementById('err-age').textContent = 'Minimum age is 14.'; ok = false; }
    if (!validateEmail(email)) { document.getElementById('err-email').textContent = 'Please enter a valid email.'; ok = false; }
    if (!validatePhone(phone)) { document.getElementById('err-phone').textContent = 'Please enter a valid phone number.'; ok = false; }
    if (!role) { document.getElementById('err-role').textContent = 'Please select a volunteer role.'; ok = false; }

    if (!ok) {
      window.scrollTo({ top: document.getElementById('volunteer-form').offsetTop - 80, behavior: 'smooth' });
      return;
    }

    // simulate sending
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
      // show modal
      const modal = document.getElementById('vol-success');
      if (modal) {
        modal.setAttribute('aria-hidden', 'false');
      }
      // reset form lightly (keep files maybe)
      form.reset();
      resumePreview.innerHTML = '';
      photoPreview.innerHTML = '';
    }, 900);
  });

  // clear button
  clearBtn && clearBtn.addEventListener('click', function () {
    form.reset();
    clearErrors();
    resumePreview.innerHTML = '';
    photoPreview.innerHTML = '';
  });

  // modal close handlers
  const modal = document.getElementById('vol-success');
  modal && modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.setAttribute('aria-hidden','true');
    }
  });
  const closeBtn = modal && modal.querySelector('.close-modal');
  closeBtn && closeBtn.addEventListener('click', function () {
    modal.setAttribute('aria-hidden','true');
  });
  const okBtn = document.getElementById('vol-ok');
  okBtn && okBtn.addEventListener('click', function () {
    modal.setAttribute('aria-hidden','true');
  });
});
