# Progetto Ilenia Tagliaferro — Contesto per Claude

> Leggi questo file all'inizio di ogni sessione per avere il contesto completo.
> Aggiorna la sezione "Stato attuale" ogni volta che qualcosa cambia.

---

## Persone

- **Pier** — sviluppatore, gestisce tutto il digitale per Ilenia
- **Ilenia Tagliaferro** — psicologa clinica, cliente/fidanzata di Pier

---

## Dati fissi Ilenia (non chiedere mai)

- Nome completo: Dott.ssa Ilenia Tagliaferro
- P.IVA: 04642290987
- Tel: 392 821 5608
- Email attuale: ilenia.tagliaferro1@gmail.com
- Email professionale da creare: ilenia@ileniatagliaferro.it (su Aruba, da fare)
- Indirizzo studio: Via G. Zadei, 60 · Brescia (25128)
- Instagram: @psicologa_ileniatagliaferro
- Sito: ileniatagliaferro.it
- Professione: Psicologa Clinica, Specializzanda in Psicoterapia Cognitivo-Comportamentale (CBT)
- Studio: Psiche Holos (psicheholos.it)

---

## Palette colori (non deviare mai)

- dark:    #2E2240
- primary: #48365A
- mid:     #654E78
- light:   #8E76A4
- pale:    #B5A3C7
- lavanda: #D8CEE4
- blush:   #EDE6F4

---

## Infrastruttura

- **Hosting**: Aruba (dominio + hosting + email inclusa, credenziali di Ilenia)
- **Sito**: GitHub Pages, repo CharPLop/itfsite, branch main
- **Dominio**: ileniatagliaferro.it — puntato su GitHub Pages tramite CNAME
- **DNS**: gestito da Aruba
- **Email professionale**: da creare su Aruba (casella inclusa nel piano hosting)
- **Analytics**: GA4 attivo, ID: G-Z0CZXPLDKG
- **Google Search Console**: da configurare (richiede account Ilenia)
- **Google Business Profile**: profilo esistente "Dott.ssa Ilenia Tagliaferro, Via Guido Zadei, Brescia" — da reclamare/verificare

---

## Progetti attivi

### 1. itfsite — sito personale
- **URL live**: https://ileniatagliaferro.it
- **Repo**: CharPLop/itfsite
- **Stack**: HTML/CSS/JS vanilla, GitHub Pages
- **File principali**: index.html, css/style.css, js/main.js, data/content.json
- **Note importanti**:
  - FAQ hardcoded in index.html (NON in content.json)
  - "Specializzanda" — NON cambiare in "in formazione"
  - Sede secondaria (Iseo) rimossa/commentata, vedi sezioni_nascoste.html
  - Footer usa logo-ilenia-footer.png (versione lavanda su sfondo viola scuro)
  - Nav/Hero usa logo-ilenia.png (colori originali alta risoluzione)

### 2. ph-tools — PWA template Instagram
- **URL**: charplop.github.io/ph-tools
- **Stato**: attivo, non in sviluppo attivo

### 3. Biglietto da visita Ilenia
- **Formato**: 85×55mm, pronto per stampa Vistaprint
- **Fronte**: sfondo blush (#EDE6F4), barra sinistra viola, logo IMG_2601, 2 colonne contatti
- **Retro**: sfondo viola scuro (#48365A), logo IMG_2543 (toni lilla), frase, QR code
- **Frase**: "Chiedere aiuto non è un segno di debolezza. / È il primo passo verso il cambiamento."
- **QR**: punta a https://ileniatagliaferro.it
- **Stack generazione**: Python + ReportLab + Pillow + qrcode + numpy + pdf2image
- **Output**: PNG 400dpi
- **Decisione stampa**: biglietti standard (non NFC)

---

## Loghi disponibili

| File upload | Descrizione | Uso |
|---|---|---|
| IMG_2601.png | IT colorato viola+foglie, 1313×875px, trasparente | Logo nav/hero sito |
| IMG_2543.png | IT toni lilla chiari, trasparente | Logo retro biglietto + footer sito |
| 45B0DD96.png | IT lilla più saturo, trasparente | Alternativa |
| IMG_2597.png | Psiche Holos verde, trasparente | Logo studio |

- **Rimozione sfondo**: pixel R>240 & G>240 & B>240 → alpha=0
- **Nel repo itfsite**: images/logo-ilenia.png (nav) e images/logo-ilenia-footer.png (footer)

---

## SEO — Stato attuale (aggiornato 2026-03-21)

### Fatto ✓
- Title tag: "Psicologa Brescia, Iseo, Rovato | Dott.ssa Ilenia Tagliaferro"
- Meta description con città target
- Tag canonical
- Schema.org: tipo doppio Psychologist + LocalBusiness
- FAQPage schema (rich snippet Google)
- Alt text immagini con keyword geografiche
- Sitemap aggiornata (lastmod 2026-03-21)
- robots.txt corretto

### Da fare — Pier
- [ ] Reclamare Google Business Profile (profilo già esistente, da verificare)
- [ ] Pagine /iseo.html e /rovato.html (frontend — in pausa)
- [ ] Testi body con più occorrenze keyword città (frontend — in pausa)

### Da fare — con account Ilenia
- [ ] Google Search Console: verifica + invio sitemap
- [ ] Email professionale ilenia@ileniatagliaferro.it (creare su Aruba)
- [ ] Doctolib / MioDottore (backlink autorevoli)
- [ ] Recensioni Google (chiede ai pazienti)
- [ ] Link da psicheholos.it al profilo individuale

### Lungo termine
- [ ] Blog (1 articolo/mese)

---

## Stack tecnico biglietti

```
Python + ReportLab + Pillow + qrcode + numpy + pdf2image
Output: PNG 400dpi
Coordinate ReportLab: origine bottom-left
```

---

## Regole di lavoro

- Mostra sempre fronte E retro insieme quando modifichi il biglietto
- Output biglietti sempre a 400dpi
- Non cambiare mai palette, font o proporzioni senza esplicita richiesta
- Per il sito: modifiche sempre su file locali, poi commit GitHub
- Aggiorna questo file ogni volta che cambia qualcosa di rilevante

---

## Storico decisioni

- **2026-03**: Hosting su Aruba — dominio + hosting + email inclusa nel piano
- **2026-03**: Biglietti standard scelti (non NFC)
- **2026-03**: Footer sito → logo versione lavanda (logo-ilenia-footer.png)
- **2026-03**: GA4 configurato ID G-Z0CZXPLDKG
- **2026-03**: SEO backend completato (title, schema LocalBusiness, canonical, FAQPage schema)
- **2026-03**: Sede secondaria Iseo rimossa temporaneamente dal sito
