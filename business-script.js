// Business Form - Simple & Clean

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form-card');
  if (!form) return;

  // Get form elements
  const fullName = form.querySelector('input[type="text"]');
  const phone = form.querySelector('input[type="tel"]');
  const email = form.querySelector('input[type="email"]');
  const country = form.querySelector('select');
  const message = form.querySelector('textarea');
  const consent = form.querySelector('#consent1');
  const submitBtn = form.querySelector('.btn-submit');

  // Initialize
  loadSavedData();
  setupEventListeners();

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    // Save data while typing
    [fullName, phone, email, country, message].forEach(input => {
      if (input) {
        input.addEventListener('input', saveData);
        input.addEventListener('change', saveData);
      }
    });

    // Validation on blur
    if (email) email.addEventListener('blur', validateEmail);
    if (phone) phone.addEventListener('blur', validatePhone);

    // Submit form
    submitBtn.addEventListener('click', handleSubmit);

    // Save consent
    if (consent) consent.addEventListener('change', saveData);
  }

  // ========== SAVE & LOAD DATA ==========
  function saveData() {
    const data = {
      fullName: fullName?.value || '',
      phone: phone?.value || '',
      email: email?.value || '',
      country: country?.value || '',
      message: message?.value || '',
      consent: consent?.checked || false,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('formData', JSON.stringify(data));
    console.log('Data saved ✓');
  }

  function loadSavedData() {
    const saved = localStorage.getItem('formData');
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (fullName) fullName.value = data.fullName || '';
      if (phone) phone.value = data.phone || '';
      if (email) email.value = data.email || '';
      if (country) country.value = data.country || '';
      if (message) message.value = data.message || '';
      if (consent) consent.checked = data.consent || false;
      console.log('Data loaded ✓');
    } catch (e) {
      console.error('Load error:', e);
    }
  }

  // ========== VALIDATION ==========
  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = email.value.trim() === '' || emailRegex.test(email.value);
    email.style.borderColor = isValid ? '#e0dcd5' : '#ff6b6b';
    return isValid;
  }

  function validatePhone() {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    const isValid = phone.value.trim() === '' || phoneRegex.test(phone.value);
    phone.style.borderColor = isValid ? '#e0dcd5' : '#ff6b6b';
    return isValid;
  }

  function validateAllFields() {
    if (!fullName?.value.trim()) {
      showError('Enter your full name');
      return false;
    }
    if (!phone?.value.trim()) {
      showError('Enter your phone number');
      return false;
    }
    if (!email?.value.trim()) {
      showError('Enter your email');
      return false;
    }
    if (!validateEmail()) {
      showError('Invalid email');
      return false;
    }
    if (!validatePhone()) {
      showError('Invalid phone');
      return false;
    }
    if (consent && !consent.checked) {
      showError('Accept terms to continue');
      return false;
    }
    return true;
  }

  // ========== FORM SUBMISSION ==========
  function handleSubmit(e) {
    e.preventDefault();

    if (!validateAllFields()) return;

    // Show loading
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Prepare data
    const formData = {
      fullName: fullName?.value.trim() || '',
      phone: phone?.value.trim() || '',
      email: email?.value.trim() || '',
      country: country?.value || '',
      message: message?.value.trim() || '',
      consent: consent?.checked || false,
      submittedAt: new Date().toISOString()
    };

    // Save submission
    const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    allSubmissions.push(formData);
    localStorage.setItem('submissions', JSON.stringify(allSubmissions));

    console.log('Submitted:', formData);

    // Simulate delay
    setTimeout(() => {
      showSuccess('Submitted! Check your email.');
      clearFormData();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  }

  function clearFormData() {
    if (fullName) fullName.value = '';
    if (phone) phone.value = '';
    if (email) email.value = '';
    if (country) country.value = '';
    if (message) message.value = '';
    localStorage.removeItem('formData');
  }

  // ========== NOTIFICATIONS ==========
  function showError(msg) {
    showNotification('error', '❌ ' + msg);
  }

  function showSuccess(msg) {
    showNotification('success', '✓ ' + msg);
  }

  function showNotification(type, msg) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      color: white;
    `;

    if (type === 'error') {
      notif.style.backgroundColor = '#ff6b6b';
    } else {
      notif.style.backgroundColor = '#51cf66';
    }

    notif.textContent = msg;
    document.body.appendChild(notif);

    // Add animation once
    if (!document.querySelector('[data-notif-style]')) {
      const style = document.createElement('style');
      style.setAttribute('data-notif-style', 'true');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => notif.remove(), 4000);
  }

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('%cForm System Active ✓', 'color: #c9a96e; font-size: 14px; font-weight: bold');
  console.log('%cData stored in: localStorage → formData, submissions', 'color: #888; font-size: 12px');
});