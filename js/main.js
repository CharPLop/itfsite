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
// La scelta si salva con la data: dopo 6 mesi il banner viene riproposto
// (Linee guida cookie del Garante, 10/6/2021). "Preferenze cookie" la revoca
// e cancella i cookie _ga gia' salvati.
var CONSENSO_DURATA = 1000 * 60 * 60 * 24 * 182; // circa 6 mesi

function leggiConsenso() {
  try {
    var v = localStorage.getItem('cookie_consent');
    if (!v) return null;
    if (v === 'granted' || v === 'denied') { // formato precedente, senza data: lo aggiorno
      localStorage.setItem('cookie_consent', JSON.stringify({ stato: v, data: Date.now() }));
      return v;
    }
    var c = JSON.parse(v);
    if (!c || !c.data || Date.now() - c.data > CONSENSO_DURATA) return null;
    return c.stato;
  } catch (e) { return null; }
}

function cancellaCookieGA() {
  var dominio = location.hostname.split('.').slice(-2).join('.');
  document.cookie.split(';').forEach(function (c) {
    var nome = c.split('=')[0].trim();
    if (nome.indexOf('_ga') === 0) {
      [location.hostname, '.' + location.hostname, '.' + dominio].forEach(function (d) {
        document.cookie = nome + '=; Max-Age=0; path=/; domain=' + d;
      });
      document.cookie = nome + '=; Max-Age=0; path=/';
    }
  });
}

setTimeout(() => {
  if (!leggiConsenso()) {
    var b = document.getElementById('cookieBanner');
    if (b) b.classList.add('show');
  }
}, 200);

function setConsent(granted) {
  try { localStorage.setItem('cookie_consent', JSON.stringify({ stato: granted ? 'granted' : 'denied', data: Date.now() })); } catch (e) {}
  const b = document.getElementById('cookieBanner');
  if (b) b.classList.remove('show');
  if (granted) {
    try { loadGA(); } catch (e) {}
  } else {
    try { gtag('consent', 'update', { analytics_storage: 'denied' }); } catch (e) {}
    cancellaCookieGA();
  }
}

// se il consenso era gia stato dato (da meno di 6 mesi), carica GA ora
if (leggiConsenso() === 'granted') { try { loadGA(); } catch (e) {} }

function revokeConsent() {
  try { localStorage.removeItem('cookie_consent'); } catch (e) {}
  try { gtag('consent', 'update', { analytics_storage: 'denied' }); } catch (e) {}
  cancellaCookieGA();
  if (window.gaLoaded) { location.reload(); return; } // GA gia' caricato: si riparte puliti
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
