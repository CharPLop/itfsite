// === CMS CONTENT LOADING ===
(async function loadCMS() {
  try {
    const r = await fetch('data/content.json');
    if (!r.ok) return;
    const d = await r.json();

    // Helper
    const set = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.textContent = val; };
    const setHTML = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.innerHTML = val; };

    // Hero
    if (d.hero) {
      set('.hero-intro', d.hero.intro);
      setHTML('.hero h1', `<strong>${d.hero.nome}</strong><em>${d.hero.sottotitolo}</em>`);
      set('.hero-desc', d.hero.descrizione);
      set('.hero-spec', d.hero.specialita);
    }

    // Chi sono
    if (d.chi_sono) {
      const chiPs = document.querySelectorAll('#chi-sono .section-text');
      if (chiPs[0]) chiPs[0].textContent = d.chi_sono.paragrafo_1;
      if (chiPs[1]) chiPs[1].textContent = d.chi_sono.paragrafo_2;
    }

    // Servizi
    if (d.servizi && d.servizi.length) {
      const grid = document.querySelector('.cosa-grid');
      if (grid) {
        grid.innerHTML = d.servizi.map((s, i) =>
          `<div class="cosa-card reveal visible${i > 0 ? ' rd' + (i % 4) : ''}"><span class="cosa-card-icon">${s.icona}</span><h3>${s.titolo}</h3><p>${s.testo}</p></div>`
        ).join('');
      }
    }

    // FAQ
    if (d.faq && d.faq.length) {
      const list = document.querySelector('.faq-list');
      if (list) {
        list.innerHTML = d.faq.map(f =>
          `<div class="faq-item reveal visible"><button class="faq-q" onclick="toggleFaq(this)">${f.domanda}</button><div class="faq-a">${f.risposta}</div></div>`
        ).join('');
      }
    }

    // Sedi
    if (d.sedi && d.sedi.length) {
      const container = document.querySelector('.dove-sedi');
      if (container) {
        container.innerHTML = d.sedi.map(s => {
          const isPr = s.tipo === 'principale';
          return `<div class="sede-card ${isPr ? 'sede-principale' : 'sede-secondaria'} reveal visible">
            <span class="sede-badge">${isPr ? 'Sede principale' : 'Sede secondaria'}</span>
            <div class="sede-header">
              <div class="sede-info">
                <h3>📍 ${s.nome}</h3>
                <p style="font-size:.92rem;color:var(--text-light);line-height:1.6">${s.indirizzo}</p>
                <div class="sede-details">
                  <div class="sede-detail"><span class="sede-detail-icon">🕐</span> ${s.orari}</div>
                  <div class="sede-detail"><span class="sede-detail-icon">📱</span> <a href="tel:${s.telefono.replace(/\s/g,'')}" style="color:inherit;text-decoration:none">${s.telefono}</a></div>
                  ${isPr ? '<div class="sede-detail"><span class="sede-detail-icon">🖥️</span> Anche online</div>' : ''}
                </div>
                ${isPr && d.contatti ? `<div class="dove-social">
                  <a href="https://www.instagram.com/${d.contatti.instagram}/" target="_blank" class="ig-pers">💜 @${d.contatti.instagram}</a>
                  <a href="https://www.instagram.com/${d.contatti.instagram_studio}/" target="_blank" class="ig-studio">🌿 @${d.contatti.instagram_studio}</a>
                </div>` : ''}
              </div>
              ${s.mappa_embed ? `<div class="sede-map"><iframe src="${s.mappa_embed}" allowfullscreen loading="lazy"></iframe></div>` : ''}
            </div>
          </div>`;
        }).join('');
      }
    }

    // Contatti (WhatsApp links)
    if (d.contatti) {
      const waMsg = encodeURIComponent(d.contatti.whatsapp_msg);
      document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        a.href = `https://wa.me/39${d.contatti.telefono}?text=${waMsg}`;
      });
    }

  } catch (e) { /* JSON not available, use HTML fallback */ }
})();

// === NAVIGATION ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

function closeNav() {
  document.getElementById('navLinks').classList.remove('open');
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
}

// === COOKIE BANNER ===
setTimeout(() => {
  try {
    if (!localStorage.getItem('cookies_accepted')) {
      document.getElementById('cookieBanner').classList.add('show');
    }
  } catch (e) {}
}, 2000);

function acceptCookies() {
  try { localStorage.setItem('cookies_accepted', 'true'); } catch (e) {}
  document.getElementById('cookieBanner').classList.remove('show');
}

// === CONTACT FORM (Web3Forms) ===
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        try { gtag('event', 'form_success', { event_category: 'contatto' }); } catch (e) {}
      }
    })
    .catch(() => {
      alert("Errore nell'invio. Riprova o contattaci su WhatsApp.");
    });
  });
}
