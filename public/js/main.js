/**
 * main.js
 *
 * All functions are modular and named self-descriptively.
 * Modules included:
 *  - Mobile navigation toggle
 *  - Dark mode toggle
 *  - Scroll-to-top button control
 *  - Smooth scroll for navigation links
 *  - Contact form handling (real backend via fetch)
 *  - Helper function for reading CSS variables
 *  - Initialization of all modules
 */

/* ==========================================================================
   MODULE: MOBILE NAVIGATION TOGGLE
   ========================================================================== */
/**
 * Toggles the mobile navigation menu and handles body scroll lock
 */
function toggleMobileNav() {
  const navLinks = document.getElementById('nav-links');
  const body = document.body;
  
  navLinks.classList.toggle('nav-open');
  body.classList.toggle('menu-open');
}

/**
 * Binds the click event to the mobile menu toggle button (#mobile-menu-toggle).
 */
function bindMobileNavToggle() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileNav);
  }

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    const navLinks = document.getElementById('nav-links');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (navLinks.classList.contains('nav-open') && 
        !navLinks.contains(event.target) && 
        !mobileMenuToggle.contains(event.target)) {
      toggleMobileNav();
    }
  });

  // Set header height CSS variable
  function updateHeaderHeight() {
    const header = document.getElementById('site-header');
    if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    }
  }

  // Update on load and resize
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);
}

/* ==========================================================================
   MODULE: DARK MODE TOGGLE
   ========================================================================== */
/**
 * On page load, read the saved theme from localStorage (if present).
 * Otherwise, use system preference. Applies data-theme to <html> and updates the button icon.
 */
function applyInitialThemePreference() {
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('preferred-theme');

  if (savedTheme === 'dark' || savedTheme === 'light') {
    htmlEl.setAttribute('data-theme', savedTheme);
    updateDarkToggleIcon(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', systemTheme);
    updateDarkToggleIcon(systemTheme);
  }
  
  // Log theme application for debugging
  console.log('Theme applied:', htmlEl.getAttribute('data-theme'));
}

/**
 * Toggles between 'light' and 'dark' themes:
 * - Updates data-theme on <html>
 * - Saves new theme to localStorage
 * - Updates the toggle button icon
 */
function toggleDarkMode() {
  const htmlEl = document.documentElement;
  const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  console.log(`Toggling theme from ${currentTheme} to ${newTheme}`);
  
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('preferred-theme', newTheme);
  
  console.log('Theme saved to localStorage');
  
  updateDarkToggleIcon(newTheme);
  
  console.log('Dark mode toggle complete');
}

/**
 * Updates the inner HTML of #dark-mode-toggle based on the current theme.
 * - If theme === 'dark', button shows sun icon
 * - If theme === 'light', button shows moon emoji
 *
 * @param {string} theme  'light' or 'dark'
 */
function updateDarkToggleIcon(theme) {
  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark'
    ? '<i class="bi bi-sun" style="color: white;"></i>'
    : '<i class="bi bi-moon" style="color: white;"></i>';
}

/**
 * Binds the click event to the Dark Mode toggle button (#dark-mode-toggle).
 */
function bindDarkModeToggle() {
  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (!toggleBtn) {
    console.warn('Dark mode toggle button not found');
    return;
  }
  
  // Remove any existing event listeners to prevent duplicates
  toggleBtn.removeEventListener('click', toggleDarkMode);
  
  // Add the event listener
  toggleBtn.addEventListener('click', toggleDarkMode);
  
  console.log('Dark mode toggle button bound successfully');
}

/* ==========================================================================
   MODULE: SCROLL-TO-TOP BUTTON CONTROL
   ========================================================================== */
/**
 * Shows or hides the scroll-to-top button (#scrollToTopBtn)
 * based on the vertical scroll position.
 */
function handleScrollToTopVisibility() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (!scrollBtn) return;
  if (window.scrollY > 300) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
}

/**
 * Smoothly scrolls the window back to the top when called.
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Binds click and scroll event listeners for the scroll-to-top button.
 */
function bindScrollToTopButton() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (!scrollBtn) return;
  scrollBtn.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', handleScrollToTopVisibility);
}

/* ==========================================================================
   MODULE: SMOOTH SCROLL FOR NAV LINKS
   ========================================================================== */
/**
 * Binds smooth scrolling behavior to all nav links inside #site-nav.
 * Closes mobile nav if open after clicking.
 */
function bindNavLinkSmoothScroll() {
  const navLinks = document.querySelectorAll('#site-nav .nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        const navLinksContainer = document.getElementById('nav-links');
        if (navLinksContainer.classList.contains('nav-open')) {
          navLinksContainer.classList.remove('nav-open');
        }
      }
    });
  });
}

/* ==========================================================================
   MODULE: CONTACT FORM HANDLING (real backend)
   ========================================================================== */

const FORM_CONFIG = {
  minNameLength: 2,
  maxNameLength: 50,
  minMessageLength: 10,
  maxMessageLength: 1000,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

/**
 * Validates a single form field in real-time
 * @param {HTMLElement} input - The input element to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(input) {
  const value = input.value.trim();
  const fieldName = input.name;
  let isValid = true;
  let message = '';

  switch (fieldName) {
    case 'name':
      if (value.length < FORM_CONFIG.minNameLength) {
        isValid = false;
        message = `Name must be at least ${FORM_CONFIG.minNameLength} characters`;
      } else if (value.length > FORM_CONFIG.maxNameLength) {
        isValid = false;
        message = `Name must be less than ${FORM_CONFIG.maxNameLength} characters`;
      }
      break;

    case 'email':
      if (!FORM_CONFIG.emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
      break;

    case 'message':
      if (value.length < FORM_CONFIG.minMessageLength) {
        isValid = false;
        message = `Message must be at least ${FORM_CONFIG.minMessageLength} characters`;
      } else if (value.length > FORM_CONFIG.maxMessageLength) {
        isValid = false;
        message = `Message must be less than ${FORM_CONFIG.maxMessageLength} characters`;
      }
      break;
  }

  // Update validation UI
  const validationMessage = input.nextElementSibling;
  if (validationMessage && validationMessage.classList.contains('validation-message')) {
    validationMessage.textContent = message;
    validationMessage.classList.toggle('error', !isValid);
    validationMessage.setAttribute('aria-hidden', isValid);
  }

  // Update input styling
  input.classList.toggle('invalid', !isValid);
  input.setAttribute('aria-invalid', !isValid);

  return isValid;
}

/**
 * Handles submission of the contact form (#contact-form).
 * Includes validation, loading state, and error handling.
 * @param {Event} event
 */
async function handleContactFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('.form-submit-btn');
  const statusEl = document.getElementById('form-status-message');
  if (!statusEl) return;

  // Get form fields
  const nameInput = document.getElementById('input-name');
  const emailInput = document.getElementById('input-email');
  const messageInput = document.getElementById('input-message');

  // Validate all fields
  const isNameValid = validateField(nameInput);
  const isEmailValid = validateField(emailInput);
  const isMessageValid = validateField(messageInput);

  if (!isNameValid || !isEmailValid || !isMessageValid) {
    statusEl.textContent = 'Please fix the errors in the form';
    statusEl.classList.remove('hidden');
    statusEl.style.color = varOrValue('--color-form-status-error', '#e74c3c');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinning"></i> Sending...';
  statusEl.textContent = 'Sending...';
  statusEl.classList.remove('hidden');
  statusEl.style.color = varOrValue('--color-text', '#2c3e50');

  // Prepare payload
  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  };

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      statusEl.textContent = result.message || 'Message sent successfully!';
      statusEl.style.color = varOrValue('--color-form-status-success', '#2ecc71');
      form.reset();

      // Reset validation UI
      form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.classList.remove('invalid');
        input.setAttribute('aria-invalid', 'false');
        const validationMessage = input.nextElementSibling;
        if (validationMessage) {
          validationMessage.textContent = '';
          validationMessage.setAttribute('aria-hidden', 'true');
        }
      });
    } else {
      throw new Error(result.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    statusEl.textContent = 'Failed to send message. Please try again later or contact me via email.';
    statusEl.style.color = varOrValue('--color-form-status-error', '#e74c3c');
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
}

/**
 * Binds the submit event listener and real-time validation to the contact form.
 */
function bindContactFormSubmit() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  // Add validation messages after each input
  contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    const validationMessage = document.createElement('div');
    validationMessage.className = 'validation-message';
    validationMessage.setAttribute('aria-live', 'polite');
    input.parentNode.insertBefore(validationMessage, input.nextSibling);

    // Add real-time validation
    input.addEventListener('input', () => validateField(input));
    input.addEventListener('blur', () => validateField(input));
  });

  // Handle form submission
  contactForm.addEventListener('submit', handleContactFormSubmission);
}

/* ==========================================================================
   HELPER FUNCTION: GET CSS VARIABLE OR FALLBACK
   ========================================================================== */
/**
 * Returns the computed value of a CSS variable or fallback if not defined.
 *
 * @param {string} varName   CSS variable name, e.g. '--color-btn-primary'
 * @param {string} fallback  Fallback value if the variable is empty
 * @returns {string}
 */
function varOrValue(varName, fallback) {
  const rootStyles = getComputedStyle(document.documentElement);
  const value = rootStyles.getPropertyValue(varName).trim();
  return value || fallback;
}

/* ==========================================================================
   MODULE: CAROUSEL FUNCTIONALITY
   ========================================================================== */
const initCarousel = () => {
  const carousel = document.querySelector('.about-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const indicators = carousel.querySelectorAll('.indicator');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  let currentSlide = 0;
  let autoAdvance;

  const showSlide = (index) => {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };

  const startAutoAdvance = () => {
    if (autoAdvance) clearInterval(autoAdvance);
    autoAdvance = setInterval(nextSlide, 8000);
  };

  const stopAutoAdvance = () => {
    if (autoAdvance) {
      clearInterval(autoAdvance);
      autoAdvance = null;
    }
  };

  // Event listeners
  prevBtn.addEventListener('click', () => {
    prevSlide();
    // Restart autoplay
    stopAutoAdvance();
    startAutoAdvance();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    // Restart autoplay
    stopAutoAdvance();
    startAutoAdvance();
  });

  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      // Restart autoplay
      stopAutoAdvance();
      startAutoAdvance();
    });
  });

  // Pause auto-advance on hover
  carousel.addEventListener('mouseenter', stopAutoAdvance);
  carousel.addEventListener('mouseleave', startAutoAdvance);

  // Initialize first slide and start auto-advance
  showSlide(0);
  startAutoAdvance();
};

/* ==========================================================================
   MODULE: INTRO BOKEH EFFECT
   ========================================================================== */
const initIntroBokehEffect = () => {
  const introSection = document.getElementById('section-intro');
  const bokehContainer = introSection.querySelector('.bokeh-container');
  if (!introSection || !bokehContainer) return;

  // Constants for orbital configuration
  const ORBITAL_CONFIG = {
    SPEEDS: [0.05, 0.045, 0.04, 0.035, 0.03, 0.025, 0.02, 0.015], // Mercury to Neptune
    BASE_RADIUS: 100,
    RADIUS_STEPS: [0, 40, 70, 100, 160, 220, 280, 340],
    WOBBLE_SPEED: 0.002,
    WOBBLE_RANGE: 30,
    VERTICAL_RANGE: 7.5
  };

  // Create main bokeh light (sun)
  const mainLight = document.createElement('div');
  mainLight.className = 'bokeh-light main';
  bokehContainer.appendChild(mainLight);

  // Create orbital lights (planets)
  const createOrbitalLight = (index) => {
    const light = document.createElement('div');
    light.className = 'bokeh-light orbital';
    light.angle = Math.random() * Math.PI * 2;
    light.speed = ORBITAL_CONFIG.SPEEDS[index];
    light.radius = ORBITAL_CONFIG.BASE_RADIUS + ORBITAL_CONFIG.RADIUS_STEPS[index] + (Math.random() * 15 - 7.5);
    light.wobble = Math.random() * Math.PI * 2;
    light.wobbleSpeed = ORBITAL_CONFIG.WOBBLE_SPEED + Math.random() * ORBITAL_CONFIG.WOBBLE_SPEED;
    light.verticalOffset = Math.random() * ORBITAL_CONFIG.VERTICAL_RANGE * 2 - ORBITAL_CONFIG.VERTICAL_RANGE;
    return light;
  };

  // Add orbital lights (planets)
  const orbitalLights = Array.from({ length: 8 }, (_, index) => {
    const light = createOrbitalLight(index);
    bokehContainer.appendChild(light);
    return light;
  });

  // Liquid motion parameters
  const liquid = {
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    previous: { x: 0, y: 0 },
    points: Array(8).fill().map(() => ({ x: 0, y: 0 })),
    ease: 0.15
  };

  const lerp = (start, end, t) => start * (1 - t) + end * t;

  const updateLiquidMotion = () => {
    liquid.previous.x = liquid.current.x;
    liquid.previous.y = liquid.current.y;

    // Update trail points
    for (let i = liquid.points.length - 1; i > 0; i--) {
      const weight = (liquid.points.length - i) / liquid.points.length;
      liquid.points[i].x = lerp(liquid.points[i].x, liquid.points[i - 1].x, liquid.ease * weight);
      liquid.points[i].y = lerp(liquid.points[i].y, liquid.points[i - 1].y, liquid.ease * weight);
    }
    
    liquid.points[0].x = lerp(liquid.points[0].x, liquid.target.x, liquid.ease * 1.2);
    liquid.points[0].y = lerp(liquid.points[0].y, liquid.target.y, liquid.ease * 1.2);

    // Calculate weighted average position
    let totalWeight = 0;
    liquid.current.x = 0;
    liquid.current.y = 0;
    
    liquid.points.forEach((point, i) => {
      const weight = (liquid.points.length - i) / liquid.points.length;
      totalWeight += weight;
      liquid.current.x += point.x * weight;
      liquid.current.y += point.y * weight;
    });
    
    liquid.current.x /= totalWeight;
    liquid.current.y /= totalWeight;

    // Calculate motion parameters
    const dx = liquid.current.x - liquid.previous.x;
    const dy = liquid.current.y - liquid.previous.y;
    const angle = Math.atan2(dy, dx);
    const velocity = Math.hypot(dx, dy);
    const distance = Math.hypot(
      liquid.target.x - liquid.current.x,
      liquid.target.y - liquid.current.y
    );

    // Calculate stretch effect
    const maxStretch = 1.2;
    const baseStretch = 1.05;
    const stretchX = baseStretch + (Math.abs(dx) / 80) * (distance / 800);
    const stretchY = baseStretch + (Math.abs(dy) / 80) * (distance / 800);
    
    // Apply transform with hardware acceleration
    const transform = `translate3d(${liquid.current.x}px, ${liquid.current.y}px, 0) 
                      rotate(${angle * (180 / Math.PI)}deg) 
                      scale(${Math.min(stretchX, maxStretch)}, ${Math.min(stretchY, maxStretch)})`;
    
    mainLight.style.transform = transform;

    return liquid.current;
  };

  const updateLights = () => {
    const position = updateLiquidMotion();

    // Update orbital lights
    orbitalLights.forEach((light, index) => {
      light.angle += light.speed * 0.02;
      light.wobble += light.wobbleSpeed;
      
      const wobbleRadius = light.radius + Math.sin(light.wobble) * ORBITAL_CONFIG.WOBBLE_RANGE;
      const x = position.x + Math.cos(light.angle) * wobbleRadius * 1.2;
      const y = position.y + Math.sin(light.angle) * wobbleRadius * 0.8 +
                Math.sin(light.wobble) * light.verticalOffset;
      
      // Use transform instead of left/top for better performance
      light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  // Event listener for mouse movement
  introSection.addEventListener('mousemove', (e) => {
    const rect = introSection.getBoundingClientRect();
    liquid.target.x = e.clientX - rect.left;
    liquid.target.y = e.clientY - rect.top;
  });

  // Animation loop
  let animationFrame;
  const animate = () => {
    updateLights();
    animationFrame = requestAnimationFrame(animate);
  };

  // Start animation
  animate();

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationFrame);
    introSection.removeEventListener('mousemove');
  };
};

/* ==========================================================================
   MODULE: INITIALIZATION
   ========================================================================== */
/**
 * Initializes all interactive modules once the DOM is fully loaded.
 */
function initializeAllModules() {
  console.log('Initializing all modules...');
  
  // Try to initialize all modules, but only if they exist on the page
  bindMobileNavToggle();
  bindScrollToTopButton();
  bindNavLinkSmoothScroll();
  
  // Only initialize these if the relevant elements exist
  if (document.getElementById('contact-form')) {
    bindContactFormSubmit();
  }
  
  if (document.querySelector('.carousel-container')) {
    initCarousel();
  }
  
  if (document.querySelector('#section-intro')) {
    initIntroBokehEffect();
  }

  /* Dark Mode must initialize early so CSS picks correct variables */
  applyInitialThemePreference();
  bindDarkModeToggle();
  
  // Initialize dropdown menus
  initDropdownMenus();
  
  // Initialize project filters if they exist
  if (document.querySelector('.filter-btn')) {
    initProjectFilters();
  }
  
  console.log('All modules initialized.');
}

// Run initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeAllModules);

/**
 * Initializes dropdown menu functionality
 */
function initDropdownMenus() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  if (!dropdownToggles.length) {
    console.log('No dropdown toggles found on this page');
    return;
  }

  console.log('Initializing dropdown menus');
  
  // First, let's create a safer way to get the dropdown menu for a toggle
  const getDropdownMenu = (toggle) => {
    if (!toggle) return null;
    const menu = toggle.nextElementSibling;
    if (menu && menu.classList && menu.classList.contains('dropdown-menu')) {
      return menu;
    }
    return null;
  };
  
  // Process each dropdown toggle
  dropdownToggles.forEach(toggle => {
    // Make sure this toggle actually has a dropdown menu
    const dropdown = getDropdownMenu(toggle);
    if (!dropdown) return;
    
    // Remove existing listeners to prevent duplicates
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    newToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = getDropdownMenu(newToggle);
      if (!dropdown) return;
      
      const isExpanded = newToggle.getAttribute('aria-expanded') === 'true';
      
      // Close all other dropdowns
      dropdownToggles.forEach(otherToggle => {
        if (otherToggle !== newToggle) {
          const otherMenu = getDropdownMenu(otherToggle);
          if (otherToggle && otherMenu) {
            otherToggle.setAttribute('aria-expanded', 'false');
            otherMenu.classList.remove('show');
          }
        }
      });

      // Toggle current dropdown
      newToggle.setAttribute('aria-expanded', !isExpanded);
      dropdown.classList.toggle('show');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      dropdownToggles.forEach(toggle => {
        const dropdown = getDropdownMenu(toggle);
        if (toggle && dropdown) {
          toggle.setAttribute('aria-expanded', 'false');
          dropdown.classList.remove('show');
        }
      });
    }
  });

  // Handle keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownToggles.forEach(toggle => {
        const dropdown = getDropdownMenu(toggle);
        if (toggle && dropdown) {
          toggle.setAttribute('aria-expanded', 'false');
          dropdown.classList.remove('show');
        }
      });
    }
  });
  
  // Highlight current page in dropdown if we're on a tool page
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  if (filename && filename !== '') {
    const currentPageLink = document.querySelector(`.dropdown-item[href$="${filename}"]`);
    if (currentPageLink) {
      currentPageLink.classList.add('active');
      currentPageLink.setAttribute('aria-current', 'page');
      console.log('Current page highlighted in dropdown:', filename);
    }
  }
}

// Dropdown menus are initialized in initializeAllModules function
// No need for a separate event listener here

/**
 * Initializes project filtering functionality
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) {
    console.log('Project filters not initialized (elements not found)');
    return;
  }

  console.log('Initializing project filters');

  filterBtns.forEach(btn => {
    // Remove existing listeners to prevent duplicates
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      newBtn.classList.add('active');

      const filterValue = newBtn.getAttribute('data-filter');
      console.log('Filtering projects by:', filterValue);

      // Filter projects
      projectCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'block';
        } else {
          const cardCategory = card.getAttribute('data-category');
          if (cardCategory === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}


