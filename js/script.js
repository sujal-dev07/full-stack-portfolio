/**
 * COLLECTION INDUSTRIES DESIGN SYSTEM
 * Client-Side Controller
 * Candidate: Sujal Parmar · Full Stack Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Colophon Year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function closeDrawer() {
    if (mobileToggle && mobileDrawer) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      mobileDrawer.classList.remove('open');
    }
  }

  function openDrawer() {
    if (mobileToggle && mobileDrawer) {
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      mobileDrawer.classList.add('open');
    }
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close when tapping a drawer link
    document.querySelectorAll('.drawer-link').forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    });

    // Close on outside tap
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeDrawer();
      }
    });
  }

  // 3. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 4. Active Navigation State Tracking
  const observedSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && observedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -55% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          desktopNavLinks.forEach((link) => {
            const linkTarget = link.getAttribute('href');
            if (linkTarget === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  // 5. Contact Form Transmission (Web3Forms)
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && submitBtn && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('#form-name');
      const emailInput = contactForm.querySelector('#form-email');
      const messageInput = contactForm.querySelector('#form-message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        formFeedback.className = 'form-feedback error label-md';
        formFeedback.textContent = 'Please complete all required fields.';
        return;
      }

      // Transmission State
      submitBtn.disabled = true;
      const btnTextSpan = submitBtn.querySelector('.btn-text');
      const originalText = btnTextSpan ? btnTextSpan.textContent : 'Transmit Inquiry';
      if (btnTextSpan) {
        btnTextSpan.textContent = 'Transmitting...';
      }
      formFeedback.className = 'form-feedback label-md';
      formFeedback.textContent = '';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          formFeedback.className = 'form-feedback success label-md';
          formFeedback.textContent = 'Transmission received. I will review and reply directly.';
          contactForm.reset();
        } else {
          formFeedback.className = 'form-feedback error label-md';
          formFeedback.textContent = data.message || 'Transmission failed. Inquire directly at sujaldev090@gmail.com.';
        }
      } catch (err) {
        formFeedback.className = 'form-feedback error label-md';
        formFeedback.textContent = 'Transmission interrupted. Inquire directly at sujaldev090@gmail.com.';
      } finally {
        submitBtn.disabled = false;
        if (btnTextSpan) {
          btnTextSpan.textContent = originalText;
        }
      }
    });
  }
});
