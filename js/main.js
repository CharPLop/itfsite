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


    // Blog
    if (d.blog && d.blog.length) {
      const bGrid = document.getElementById('blogGrid');
      const bEmpty = document.getElementById('blogEmpty');
      if (bGrid) {
        bGrid.innerHTML = d.blog.map((art, i) => {
          const date = new Date(art.data);
          const dateStr = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
          const slug = art.titolo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
          return `<a class="blog-card reveal visible${i > 0 ? ' reveal-delay-' + i : ''}" href="#articolo-${slug}" onclick="openArticle(${i}); return false;">
            <div class="blog-card-img-placeholder">${art.icona || '📝'}</div>
            <div class="blog-card-body">
              <div class="blog-card-date">${dateStr}</div>
              <h3 class="blog-card-title">${art.titolo}</h3>
              <p class="blog-card-excerpt">${art.estratto}</p>
              <span class="blog-card-read">Leggi l'articolo →</span>
            </div>
          </a>`;
        }).join('');
        if (bEmpty) bEmpty.style.display = 'none';
      }
      // Store blog data globally for article view
      window.__blogData = d.blog;
    } else {
      const bGrid = document.getElementById('blogGrid');
      const bEmpty = document.getElementById('blogEmpty');
      if (bGrid) bGrid.innerHTML = '';
      if (bEmpty) bEmpty.style.display = 'block';
    }

  } catch (e) { /* JSON not available, use HTML fallback */ }
})();

// === NAVIGATION ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

function toggleNav() {
  var nav = document.getElementById('nav');
  nav.classList.toggle('nav-open');
  document.querySelector('.hamburger').classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('nav-open') ? 'hidden' : '';
}

function closeNav() {
  document.getElementById('nav').classList.remove('nav-open');
  document.querySelector('.hamburger').classList.remove('active');
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

// === BLOG ARTICLE OVERLAY ===
function openArticle(index) {
  const articles = window.__blogData;
  if (!articles || !articles[index]) return;
  const art = articles[index];
  const date = new Date(art.data);
  const dateStr = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  // Create overlay
  let overlay = document.getElementById('blogOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'blogOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9999;display:flex;justify-content:center;overflow-y:auto;padding:40px 16px;backdrop-filter:blur(4px)';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="blog-article" style="background:#fff;border-radius:20px;padding:40px;max-width:720px;width:100%;margin:auto;position:relative;max-height:fit-content">
    <a href="#" class="blog-article-back" onclick="closeArticle(); return false;">← Torna agli articoli</a>
    <div class="blog-article-date">${dateStr}</div>
    <h1>${art.titolo}</h1>
    <div class="blog-article-content">${art.contenuto}</div>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(106,79,118,.1);text-align:center">
      <p style="font-size:.9rem;color:var(--text-light);margin-bottom:12px">Ti è stato utile? Condividilo o prenota un appuntamento</p>
      <a href="#prenota" class="btn btn-primary" onclick="closeArticle();" style="font-size:.85rem;padding:10px 24px">Prenota un colloquio</a>
    </div>
  </div>`;
  overlay.style.display = 'flex';
  overlay.addEventListener('click', e => { if (e.target === overlay) closeArticle(); });
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  const overlay = document.getElementById('blogOverlay');
  if (overlay) { overlay.style.display = 'none'; overlay.innerHTML = ''; }
  document.body.style.overflow = '';
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
