/* ================================
   LISBOM — MAIN JS
   ================================ */

// ── Nav scroll ────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Hamburger ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ── Scroll reveal ─────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Smooth scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 66, behavior: 'smooth' }); }
  });
});

// ── Roles filter ──────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const roleCards = document.querySelectorAll('.role-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    roleCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── Cost Calculator ───────────────────────────────────

// Salary data: [junior, mid, senior] in USD equivalent
const salaryData = {
  // role: { country: [junior, mid, senior] }
  va:     { uk:[28000,36000,44000], us:[38000,52000,65000], au:[42000,55000,68000], ca:[36000,48000,60000], de:[32000,44000,56000], nl:[34000,46000,58000], sg:[30000,42000,54000], ae:[28000,40000,52000] },
  cs:     { uk:[22000,28000,36000], us:[32000,42000,55000], au:[35000,46000,58000], ca:[30000,40000,52000], de:[28000,38000,50000], nl:[30000,40000,52000], sg:[26000,36000,48000], ae:[24000,34000,46000] },
  ops:    { uk:[28000,38000,50000], us:[42000,58000,75000], au:[46000,62000,78000], ca:[38000,52000,68000], de:[34000,48000,62000], nl:[36000,50000,64000], sg:[32000,46000,60000], ae:[30000,44000,58000] },
  book:   { uk:[26000,34000,44000], us:[36000,48000,62000], au:[40000,54000,68000], ca:[34000,46000,60000], de:[30000,42000,54000], nl:[32000,44000,56000], sg:[28000,40000,52000], ae:[26000,38000,50000] },
  social: { uk:[24000,32000,42000], us:[34000,46000,60000], au:[38000,50000,64000], ca:[32000,44000,58000], de:[28000,38000,50000], nl:[30000,40000,52000], sg:[26000,36000,48000], ae:[24000,34000,46000] },
  seo:    { uk:[26000,34000,46000], us:[38000,52000,68000], au:[40000,54000,70000], ca:[34000,48000,62000], de:[30000,42000,56000], nl:[32000,44000,58000], sg:[28000,40000,54000], ae:[26000,38000,52000] },
  dev:    { uk:[32000,48000,65000], us:[55000,80000,110000], au:[58000,82000,108000], ca:[50000,72000,98000], de:[46000,68000,92000], nl:[48000,70000,95000], sg:[42000,62000,88000], ae:[38000,58000,82000] },
  data:   { uk:[30000,44000,60000], us:[52000,74000,98000], au:[54000,76000,100000], ca:[46000,68000,90000], de:[42000,62000,84000], nl:[44000,64000,86000], sg:[38000,58000,80000], ae:[36000,54000,76000] },
  it:     { uk:[26000,36000,48000], us:[42000,58000,76000], au:[44000,62000,80000], ca:[38000,54000,72000], de:[34000,50000,66000], nl:[36000,52000,68000], sg:[32000,48000,64000], ae:[30000,44000,60000] },
  hr:     { uk:[24000,32000,44000], us:[38000,52000,68000], au:[40000,54000,70000], ca:[34000,48000,62000], de:[30000,42000,56000], nl:[32000,44000,58000], sg:[28000,40000,54000], ae:[26000,38000,52000] },
};

// Philippines all-in costs by role [junior, mid, senior] in USD
const phCosts = {
  va:     [6000, 9600, 14400],
  cs:     [5400, 8400, 12600],
  ops:    [6600, 10200, 15600],
  book:   [6000, 9600, 14400],
  social: [5400, 8400, 12600],
  seo:    [5400, 8400, 12600],
  dev:    [8400, 14400, 22800],
  data:   [7200, 12000, 18000],
  it:     [6000, 9600, 14400],
  hr:     [5400, 8400, 12600],
};

// Management fee (annual USD)
const mgmtFee = { va:1800, cs:1800, ops:1800, book:1800, social:1800, seo:1800, dev:2400, data:2400, it:1800, hr:1800 };

// Currency config
const currencies = {
  uk: { symbol: '£', rate: 1, label: '🇬🇧 UK Hire', taxLabel: 'Employer NI / tax', taxRate: 0.138 },
  us: { symbol: '$', rate: 1.27, label: '🇺🇸 US Hire', taxLabel: 'Payroll taxes', taxRate: 0.15 },
  au: { symbol: 'A$', rate: 1.95, label: '🇦🇺 AU Hire', taxLabel: 'Super / tax', taxRate: 0.145 },
  ca: { symbol: 'C$', rate: 1.72, label: '🇨🇦 CA Hire', taxLabel: 'CPP / EI / tax', taxRate: 0.135 },
  de: { symbol: '€', rate: 1.17, label: '🇩🇪 DE Hire', taxLabel: 'Social contributions', taxRate: 0.20 },
  nl: { symbol: '€', rate: 1.17, label: '🇳🇱 NL Hire', taxLabel: 'Social contributions', taxRate: 0.19 },
  sg: { symbol: 'S$', rate: 1.70, label: '🇸🇬 SG Hire', taxLabel: 'CPF contributions', taxRate: 0.17 },
  ae: { symbol: 'AED', rate: 4.66, label: '🇦🇪 UAE Hire', taxLabel: 'Visa / benefits', taxRate: 0.08 },
};

const levelMap = { junior: 0, mid: 1, senior: 2 };

function fmt(num, symbol) {
  return symbol + Math.round(num).toLocaleString();
}

function updateCalc() {
  const country = document.getElementById('calcCountry').value;
  const role    = document.getElementById('calcRole').value;
  const level   = document.getElementById('calcLevel').value;
  const li      = levelMap[level];
  const cur     = currencies[country];

  // Local costs in USD, then convert
  const localBaseUSD = salaryData[role][country][li];
  const localBase    = localBaseUSD * cur.rate;
  const localTax     = localBase * cur.taxRate;
  const localBen     = localBase * 0.05;
  const localTotal   = localBase + localTax + localBen;

  // Philippines costs in local currency
  const phBaseUSD    = phCosts[role][li];
  const phBase       = phBaseUSD * cur.rate;
  const phBen        = phBase * 0.20;
  const phFeeUSD     = mgmtFee[role];
  const phFee        = phFeeUSD * cur.rate;
  const phTotal      = phBase + phBen + phFee;

  const saving       = localTotal - phTotal;
  const savingPct    = Math.round((saving / localTotal) * 100);
  const s            = cur.symbol;

  document.getElementById('localLabel').textContent    = cur.label;
  document.getElementById('localSalary').textContent   = fmt(localTotal, s);
  document.getElementById('localBase').textContent     = fmt(localBase, s);
  document.getElementById('localTax').textContent      = fmt(localTax, s);
  document.getElementById('localBenefits').textContent = fmt(localBen, s);
  document.getElementById('localTotal').textContent    = fmt(localTotal, s);

  document.getElementById('phSalary').textContent      = fmt(phTotal, s);
  document.getElementById('phBase').textContent        = fmt(phBase, s);
  document.getElementById('phBenefits').textContent    = fmt(phBen, s);
  document.getElementById('phFee').textContent         = fmt(phFee, s);
  document.getElementById('phTotal').textContent       = fmt(phTotal, s);

  document.getElementById('savingAmount').textContent  = fmt(saving, s);
  document.getElementById('savingPct').textContent     = savingPct + '% less';

  // Update tax label
  document.querySelector('.calc-col.local .calc-breakdown .calc-line:nth-child(2) span:first-child').textContent = cur.taxLabel;
}

// Init and bind
document.getElementById('calcCountry').addEventListener('change', updateCalc);
document.getElementById('calcRole').addEventListener('change', updateCalc);
document.getElementById('calcLevel').addEventListener('change', updateCalc);
updateCalc();

// ── FAQ Accordion ─────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-q').forEach(b => {
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

form.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  if (!fname || !lname || !email) { form.style.animation = 'none'; requestAnimationFrame(() => { form.style.animation = 'shake 0.4s ease'; }); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('email').style.borderColor = '#ef4444'; return; }
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…'; btn.disabled = true;
  setTimeout(() => { form.style.display = 'none'; formSuccess.classList.add('show'); }, 900);
});

document.getElementById('email').addEventListener('input', function() { this.style.borderColor = ''; });
