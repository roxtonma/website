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
 * Toggles the mobile navigation menu by adding/removing the 'nav-open' class.
 */
function toggleMobileNav() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('nav-open');
}

/**
 * Binds the click event to the mobile menu toggle button (#mobile-menu-toggle).
 */
function bindMobileNavToggle() {
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', toggleMobileNav);
  }
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

  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('preferred-theme', newTheme);
  updateDarkToggleIcon(newTheme);
}

/**
 * Updates the inner text of #dark-mode-toggle based on the current theme.
 * - If theme === 'dark', button shows ☀️ (sun)
 * - If theme === 'light', button shows 🌙 (moon)
 *
 * @param {string} theme  'light' or 'dark'
 */
function updateDarkToggleIcon(theme) {
  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (!toggleBtn) return;
  toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/**
 * Binds the click event to the Dark Mode toggle button (#dark-mode-toggle).
 */
function bindDarkModeToggle() {
  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', toggleDarkMode);
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
/**
 * Handles submission of the contact form (#contact-form).
 * - Prevents default POST
 * - Shows "Sending…" status
 * - Sends JSON via fetch() to form action URL
 * - Displays success or error in #form-status-message
 *
 * @param {Event} event
 */
async function handleContactFormSubmission(event) {
  event.preventDefault();

  const nameValue = document.getElementById('input-name').value.trim();
  const emailValue = document.getElementById('input-email').value.trim();
  const messageValue = document.getElementById('input-message').value.trim();
  const statusEl = document.getElementById('form-status-message');
  if (!statusEl) return;

  // Basic validation
  if (!nameValue || !emailValue || !messageValue) {
    statusEl.textContent = 'Please fill in all fields.';
    statusEl.classList.remove('hidden');
    statusEl.style.color = 'red';
    return;
  }

  // Show pending status
  statusEl.textContent = 'Sending…';
  statusEl.classList.remove('hidden');
  statusEl.style.color = varOrValue('--color-text', '#2c3e50');

  // Prepare payload
  const payload = { name: nameValue, email: emailValue, message: messageValue };

  try {
    const response = await fetch(event.target.action, {
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
      statusEl.style.color = varOrValue('--color-btn-primary', '#1abc9c');
      event.target.reset();
    } else {
      throw new Error(result.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    statusEl.textContent = 'Failed to send message. Please try again later.';
    statusEl.style.color = 'red';
  }
}

/**
 * Binds the submit event listener to the contact form (#contact-form).
 */
function bindContactFormSubmit() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmission);
  }
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
   MODULE: INITIALIZATION
   ========================================================================== */
/**
 * Initializes all interactive modules once the DOM is fully loaded.
 */
function initializeAllModules() {
  bindMobileNavToggle();
  bindScrollToTopButton();
  bindNavLinkSmoothScroll();
  bindContactFormSubmit();

  /* Dark Mode must initialize early so CSS picks correct variables */
  applyInitialThemePreference();
  bindDarkModeToggle();
}

// Run initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeAllModules);
