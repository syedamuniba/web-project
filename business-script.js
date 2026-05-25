document.addEventListener('DOMContentLoaded', async function() {
  
  const form = document.querySelector('.form-card');
  console.log(form);
  if (!form) return;

  const successMessage = document.getElementById('successMessage');
  const phone = form.querySelector('input[type="tel"]');
  const iti = window.intlTelInput(phone, {
  initialCountry: "pk",
  separateDialCode: true,
  preferredCountries: ["pk", "sa", "ae", "us", "gb"]
});
  const email = form.querySelector('input[type="email"]');
  const country = form.querySelector('select');
  const message = form.querySelector('textarea');
  const consent = form.querySelector('#consent1');
  const submitBtn = form.querySelector('.btn-submit');

  // 🌍 Countries 
  await loadCountries();
  
  // پھر باقی
  loadSavedData();
  setupListeners();

  // ============================================
  // 🌍 COUNTRIES LOAD
  // ============================================
  
  async function loadCountries() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
      const data = await response.json();
      const countries = data.map(c => c.name.common).sort();
      
      countries.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        country.appendChild(option);
      });
      console.log('✓ Countries loaded');
    } catch (error) {
      console.log('API fail - using defaults');
    }
  }

  // ============================================
  // PART 1: EVENT LISTENERS
  // ============================================
  
  function setupListeners() {
    const inputs = [fullName, phone, email, country, message];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', saveData);
        input.addEventListener('change', saveData);
      }
    });

    if (email) email.addEventListener('blur', validateEmail);
    if (phone) phone.addEventListener('blur', validatePhone);
    submitBtn.addEventListener('click', handleSubmit);
    if (consent) consent.addEventListener('change', saveData);
  }

  // ============================================
  // PART 2: SAVE & LOAD
  // ============================================

  function saveData() {
    const formData = {
      fullName: fullName?.value || '',
      phone: phone?.value || '',
      email: email?.value || '',
      country: country?.value || '',
      message: message?.value || '',
      consent: consent?.checked || false,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('formData', JSON.stringify(formData));
    console.log('✓ Data saved');
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
      console.log('✓ Data loaded');
    } catch (e) {
      console.error('Error loading:', e);
    }
  }

  // ============================================
  // PART 3: VALIDATION
  // ============================================
 
function validateEmail() {

  const emailError = document.getElementById('emailError');

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.value.trim()) {
    emailError.textContent = 'Email is required';
    return false;
  }

  if (!pattern.test(email.value)) {
    emailError.textContent = 'Invalid email address';
    return false;
  }

  emailError.textContent = '';
  return true;
}

function validatePhone() {

  const phoneError = document.getElementById('phoneError');

  if (!phone.value.trim()) {
    phoneError.textContent = 'Phone number is required';
    return false;
  }

  phoneError.textContent = '';
  return true;
}
function validateAllFields() {


  function validateName() {

  const nameError = document.getElementById('fullNameError');

  if (!fullName.value.trim()) {
    nameError.textContent = 'Full name is required';
    return false;
  }

  nameError.textContent = '';
  return true;
}

  if (!validateName()) {

  fullName.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  fullName.focus();
  return false;
}

  if (!phone?.value.trim()) {

    phone.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    phone.focus();
    return false;
  }

  if (!email?.value.trim()) {

    email.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    email.focus();
    return false;
  }

  if (!validateEmail()) {

    email.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    email.focus();
    return false;
  }

  if (!validatePhone()) {

    phone.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    phone.focus();
    return false;
  }

  if (consent && !consent.checked) {

    consent.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    consent.focus();
    return false;
  }

  return true;
}

  // ============================================
  // PART 4: FORM SUBMIT
  // ============================================

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateAllFields()) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const submissionData = {
      fullName: fullName?.value.trim() || '',
      phone: phone?.value.trim() || '',
      email: email?.value.trim() || '',
      country: country?.value || '',
      message: message?.value.trim() || '',
      consent: consent?.checked || false,
      submittedAt: new Date().toISOString()
    };

    const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    allSubmissions.push(submissionData);
    localStorage.setItem('submissions', JSON.stringify(allSubmissions));

    console.log('Submitted:', submissionData);

    setTimeout(() => {
      form.style.display = 'none';
        successMessage.style.display = 'block';

     clearFormData();

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.style.display = 'none';
      successMessage.style.display = 'block';

clearFormData();

submitBtn.textContent = originalText;
submitBtn.disabled = false; });
  }

  function clearFormData() {
    if (fullName) fullName.value = '';
    if (phone) phone.value = '';
    if (email) email.value = '';
    if (country) country.value = '';
    if (message) message.value = '';
    localStorage.removeItem('formData');
  }

  // ============================================
  // PART 5: NOTIFICATIONS
  // ============================================

  function showError(message) {
    showNotification('error', '❌ ' + message);
  }

  function showSuccess(message) {
    showNotification('success', '✓ ' + message);
  }

  function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
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

    notification.style.backgroundColor = type === 'error' ? '#ff6b6b' : '#51cf66';
    notification.textContent = message;
    document.body.appendChild(notification);

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

    setTimeout(() => notification.remove(), 4000);
  }

  console.log('%cForm Active ✓', 'color: #c9a96e; font-size: 14px; font-weight: bold');
});