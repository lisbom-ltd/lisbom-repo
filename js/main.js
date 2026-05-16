/* ================================
   LISBOM — SHARED JS
   ================================ */

// ── Nav scroll ────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Hamburger ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  document.querySelectorAll('.mob-link').forEach(l =>
    l.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

// ── Scroll reveal ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Smooth scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ── FAQ Accordion ─────────────────────────────────────
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

// ── Contact form ──────────────────────────────────────
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (form && formSuccess) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email')?.value.trim();
    const fname = document.getElementById('fname')?.value.trim();
    const lname = document.getElementById('lname')?.value.trim();
    const emailEl = document.getElementById('email');

    if (!fname || !lname || !email) {
      form.style.animation = 'none';
      requestAnimationFrame(() => { form.style.animation = 'shake 0.4s ease'; });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (emailEl) { emailEl.style.borderColor = '#ef4444'; emailEl.focus(); }
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }, 900);
  });

  const emailEl = document.getElementById('email');
  if (emailEl) emailEl.addEventListener('input', function() { this.style.borderColor = ''; });
}

// ── Cookie Banner ──────────────────────────────────────
(function() {
  var COOKIE_KEY = 'lisbom_cookie_consent';

  function getCookie(name) {
    var v = document.cookie.match('(^|;)\s*' + name + '\s*=\s*([^;]+)');
    return v ? v.pop() : null;
  }
  function setCookie(name, val, days) {
    var d = new Date(); d.setTime(d.getTime() + days * 864e5);
    document.cookie = name + '=' + val + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }
  function clearCookie() {
    document.cookie = COOKIE_KEY + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
  }
  function loadAnalytics() {
    // Place your Google Analytics or other analytics init here
  }
  function showBanner() {
    var existing = document.getElementById('cookieBanner');
    if (existing) existing.remove();
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.innerHTML = [
      '<div class="cookie-text">',
        '<p>We use cookies to understand how you use our site and to improve your experience. ',
        'By clicking 'Accept', you consent to analytics and functional cookies. ',
        '<a href="privacy-policy.html#s7">Learn more in our Privacy Policy</a>.</p>',
      '</div>',
      '<div class="cookie-actions">',
        '<button class="cookie-btn cookie-btn-decline" id="cookieDecline">Decline</button>',
        '<button class="cookie-btn cookie-btn-accept" id="cookieAccept">Accept cookies</button>',
      '</div>'
    ].join('');
    document.body.appendChild(banner);
    document.getElementById('cookieAccept').addEventListener('click', function() {
      setCookie(COOKIE_KEY, 'accepted', 365);
      banner.remove();
      loadAnalytics();
    });
    document.getElementById('cookieDecline').addEventListener('click', function() {
      setCookie(COOKIE_KEY, 'declined', 365);
      banner.remove();
    });
  }

  // Use event delegation on document so it works regardless of when script runs
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'cookieSettingsFooter') {
      e.preventDefault();
      clearCookie();
      showBanner();
    }
  });

  // Init on load
  var consent = getCookie(COOKIE_KEY);
  if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  } else if (consent === 'accepted') {
    loadAnalytics();
  }
})();
