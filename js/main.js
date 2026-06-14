/* ============================================================
   GRADUATION PORTFOLIO — MAIN JAVASCRIPT
   ============================================================ */

// ── Theme Toggle ──────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeToggle.textContent = theme === 'dark' ? '☀' : '🌙';
}

// ── Navbar scroll ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile Menu ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Back to top ───────────────────────────────────────────
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 500);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Scroll Reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Skill bars animation ──────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// ── Counter animation ─────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isDecimal ? (eased * target).toFixed(1) : Math.round(eased * target);
    el.textContent = value + el.dataset.suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(num => {
        const target = parseFloat(num.dataset.target);
        animateCounter(num, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.getElementById('stats');
if (statsSection) counterObserver.observe(statsSection);

// ── Portfolio Filter ──────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.opacity = match ? '1' : '0.2';
      card.style.transform = match ? '' : 'scale(0.97)';
      card.style.pointerEvents = match ? 'all' : 'none';
    });
  });
});

// ── Modal ─────────────────────────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

function openModal(data) {
  const modalThumb = document.getElementById('modal-thumb');
  if (data.thumbBg) {
    modalThumb.style.backgroundImage = data.thumbBg;
    modalThumb.style.backgroundColor = 'transparent';
  } else {
    modalThumb.style.backgroundImage = '';
    modalThumb.style.backgroundColor = '';
  }

  document.getElementById('modal-thumb-icon').textContent = data.icon;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-year').innerHTML = '<b>' + data.year + '</b>';
  document.getElementById('modal-cat').innerHTML = '<b>' + data.category + '</b>';
  document.getElementById('modal-desc').textContent = data.desc;
  const toolsEl = document.getElementById('modal-tools');
  toolsEl.innerHTML = data.tools.map(t => `<span class="modal-tool">${t}</span>`).join('');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const thumb = card.querySelector('.project-thumb');
    // Read inline style directly — most reliable for background-image set via style=""
    const thumbBg = thumb ? thumb.style.backgroundImage : '';

    openModal({
      icon: card.dataset.icon,
      title: card.dataset.title,
      year: card.dataset.year,
      category: card.dataset.catLabel,
      desc: card.dataset.desc,
      tools: card.dataset.tools.split(','),
      thumbBg: thumbBg
    });
  });
});

// ── Hero canvas particle effect ───────────────────────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

const particles = Array.from({ length: 50 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.3,
  dx: (Math.random() - 0.5) * 0.3,
  dy: (Math.random() - 0.5) * 0.3,
  o: Math.random() * 0.5 + 0.1
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,169,110,${p.o})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Smooth active nav links ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
}, { passive: true });

// ── Escape key closes modal ───────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});