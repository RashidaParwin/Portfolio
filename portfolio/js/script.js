/* ==========================================================================
   DEVELOPER PORTFOLIO - CORE APPLICATION CONTROLLER
   Developer: ABDUL ASEES RASHIDA PARWIN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Loading Screen & Fade Out
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 600);
  }

  // 2. Cursor Glow Follower
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 3. Navbar Sticky Effect & Active Link Highlight
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Back To Top FAB
    const fab = document.querySelector('.back-to-top-fab');
    if (fab) {
      if (window.scrollY > 400) {
        fab.classList.add('visible');
      } else {
        fab.classList.remove('visible');
      }
    }

    // Active Section Tracking
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Mobile Navigation Toggle Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // 5. Scroll Reveal IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger Skill Progress Bars if inside
        if (entry.target.classList.contains('skill-category-card')) {
          animateSkills(entry.target);
        }
        
        // Trigger Stats Counter if inside
        if (entry.target.classList.contains('stat-card')) {
          animateCounter(entry.target);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el) => revealObserver.observe(el));

  // 6. Skill Progress Bar Animate
  function animateSkills(container) {
    const bars = container.querySelectorAll('.progress-bar-fill');
    bars.forEach((bar) => {
      const percentage = bar.getAttribute('data-percentage');
      if (percentage) {
        bar.style.width = percentage + '%';
      }
    });
  }

  // 7. Counter Animation
  function animateCounter(card) {
    const counterEl = card.querySelector('.stat-number');
    if (!counterEl || counterEl.classList.contains('counted')) return;
    
    counterEl.classList.add('counted');
    const target = parseInt(counterEl.getAttribute('data-target'), 10);
    const suffix = counterEl.getAttribute('data-suffix') || '';
    let count = 0;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));

    const timer = setInterval(() => {
      count += 1;
      counterEl.textContent = count + suffix;
      if (count >= target) {
        counterEl.textContent = target + suffix;
        clearInterval(timer);
      }
    }, Math.max(stepTime, 30));
  }

  // 8. 3D Card Tilt Effect on Hover
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 9. Button Ripple Effect
  const rippleBtns = document.querySelectorAll('.btn');
  rippleBtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;

      const ripples = document.createElement('span');
      ripples.className = 'ripple';
      ripples.style.left = x + 'px';
      ripples.style.top = y + 'px';
      this.appendChild(ripples);

      setTimeout(() => {
        ripples.remove();
      }, 600);
    });
  });

  // 10. Contact Form Real-time Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      // Clear previous error states
      [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
        if (input) input.parentElement.classList.remove('error');
      });

      // Name validation
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        isValid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }

      // Subject validation
      if (!subjectInput.value.trim()) {
        showError(subjectInput, 'Subject is required');
        isValid = false;
      }

      // Message validation
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters');
        isValid = false;
      }

      if (isValid) {
        showToast('Message sent successfully! Thank you for reaching out.');
        contactForm.reset();
      }
    });
  }

  function showError(inputEl, message) {
    const parent = inputEl.parentElement;
    parent.classList.add('error');
    const errorSpan = parent.querySelector('.form-error-msg');
    if (errorSpan) errorSpan.textContent = message;
  }

  // 11. Toast Notification Trigger
  function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
      document.body.appendChild(toast);
    } else {
      toast.querySelector('span').textContent = message;
    }

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // 12. Modal Handlers for Live Demo
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.querySelector('.modal-close');
  const demoBtns = document.querySelectorAll('.btn-demo-modal');

  demoBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projTitle = btn.getAttribute('data-title') || 'Project Demo';
      const projDesc = btn.getAttribute('data-desc') || 'Live demonstration preview.';
      
      const modalTitleEl = document.getElementById('modal-project-title');
      const modalDescEl = document.getElementById('modal-project-desc');
      
      if (modalTitleEl) modalTitleEl.textContent = projTitle;
      if (modalDescEl) modalDescEl.textContent = projDesc;

      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }
});
