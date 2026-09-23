// I contenuti della home sono statici in index.html (unica fonte di verità).
// Il caricamento da data/content.json è stato rimosso il 23/09/2026.

// === NAVIGATION ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

function toggleNav() {
  var nav = document.getElementById('nav');
  var open = nav.classList.toggle('nav-open');
  var h = document.querySelector('.hamburger');
  h.classList.toggle('active');
  h.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

function closeNav() {
  document.getElementById('nav').classList.remove('nav-open');
  var h = document.querySelector('.hamburger');
  h.classList.remove('active');
  h.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// === SCROLL REVEAL ===
try {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
} catch (e) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// Safety net: force show after 2s
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });
}, 2000);

// === FAQ ACCORDION ===
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.toggle('open');
  answer.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

// === COOKIE BANNER / CONSENT MODE v2 ===
setTimeout(() => {
  try {
    if (!localStorage.getItem('cookie_consent')) {
      document.getElementById('cookieBanner').classList.add('show');
    }
  } catch (e) {}
}, 200);

function setConsent(granted) {
  try { localStorage.setItem('cookie_consent', granted ? 'granted' : 'denied'); } catch (e) {}
  const b = document.getElementById('cookieBanner');
  if (b) b.classList.remove('show');
  if (granted) {
    try { loadGA(); } catch (e) {}
  } else {
    try { gtag('consent', 'update', { analytics_storage: 'denied' }); } catch (e) {}
  }
}

// se il consenso era gia stato dato in una visita precedente, carica GA ora
try { if (localStorage.getItem('cookie_consent') === 'granted') loadGA(); } catch (e) {}

function revokeConsent() {
  try { localStorage.removeItem('cookie_consent'); } catch (e) {}
  try { gtag('consent', 'update', { analytics_storage: 'denied' }); } catch (e) {}
  const b = document.getElementById('cookieBanner');
  if (b) b.classList.add('show');
}

// === CONTACT FORM (Web3Forms) ===
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    var err = document.getElementById('formError');
    var btnText = btn ? btn.textContent : '';
    if (err) err.style.display = 'none';
    if (btn) { btn.disabled = true; btn.textContent = 'Invio in corso…'; }
    function showError() {
      if (err) {
        err.style.display = 'block';
        err.innerHTML = 'Non sono riuscita a inviare il messaggio. Scrivimi su <a href="https://wa.me/393928215608" target="_blank" rel="noopener noreferrer" style="color:inherit">WhatsApp al 392 821 5608</a>.';
      }
    }
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(r => r.json())
    .then(d => {
      if (d && d.success) {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        try { gtag('event', 'form_success', { event_category: 'contatto' }); } catch (e) {}
      } else {
        showError();
      }
    })
    .catch(showError)
    .finally(() => { if (btn) { btn.disabled = false; btn.textContent = btnText; } });
  });
}
