# PenultimoFantaUomo — Stile "Giornale consumato"

Guida per portare la direzione di `Giornale.dc.html` nel progetto Next.js esistente
(`src/app`, Tailwind). Tutti i valori sono quelli usati nel mockup.

---

## 1. Palette

| Ruolo | Valore | Uso |
|---|---|---|
| Carta | `#efe6d2` | fondo di tutte le pagine |
| Carta (bordo/footer) | `rgba(120,92,40,.06)` sopra la carta | fascia footer, box "avviso" |
| Inchiostro | `#1b1811` | testo principale, filetti, bandiere nere |
| Inchiostro chiaro | `#3a3323` | sommari e testi in corsivo |
| Grigio testo | `#4a4231` | corpo secondario, colonnine |
| Grigio didascalie | `#6d6248` | didascalie, occhielli neutri |
| Grigio metadati | `#7a6f56` | date, numeri, etichette monospace |
| Rosso timbro | `#8c3b2c` | occhielli ("Ottava giornata"), sottolineature dei link forti |
| Filetti | `rgba(27,24,17,.22–.5)` | separatori colonne, righe punteggiate |
| Immagini | fondo `#ded3ba` / `#cec2a6` | trama mezzatinta dei segnaposto |
| Fondo esterno (scrivania) | `#22201b` | solo nel canvas dei mockup, non nel sito |

Regola: un solo colore d'accento (`#8c3b2c`). Niente secondi accenti, niente gradienti colorati.

Tailwind — da aggiungere in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      paper: "#efe6d2",
      ink: "#1b1811",
      ink2: "#3a3323",
      ink3: "#4a4231",
      muted: "#6d6248",
      meta: "#7a6f56",
      stamp: "#8c3b2c",
    },
  },
}
```

---

## 2. Font

Tre famiglie, tutte su Google Fonts (già disponibili via `next/font/google`):

| Famiglia | Ruolo | Pesi |
|---|---|---|
| **Instrument Serif** | testata, titoli, sommari in corsivo, numeri grandi, capolettera | 400, 400 italic |
| **Libre Franklin** | corpo del testo, navigazione, etichette di sezione | 400, 500, 600, 700 |
| **IBM Plex Mono** | metadati: date, punteggi, occhielli, "Anno IV · N. 8" | 400, 500, 600 |

Sostituisce Inter in `src/app/layout.tsx`:

```ts
import { Instrument_Serif, Libre_Franklin, IBM_Plex_Mono } from "next/font/google";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal","italic"], variable: "--font-serif" });
const sans  = Libre_Franklin({ subsets: ["latin"], variable: "--font-sans" });
const mono  = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400","500","600"], variable: "--font-mono" });

// <body className={`${serif.variable} ${sans.variable} ${mono.variable} font-sans bg-paper text-ink`}>
```

e in `tailwind.config.ts`:

```ts
fontFamily: {
  serif: ["var(--font-serif)", "serif"],
  sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
  mono:  ["var(--font-mono)", "monospace"],
}
```

---

## 3. Scala tipografica

| Elemento | Font | Dimensione / interlinea | Note |
|---|---|---|---|
| Testata home | serif 400 | 92px / 0.9, `letter-spacing:-0.02em` | `text-shadow: 0 1px 0 rgba(255,255,255,.35)` per l'effetto stampa |
| Titolo apertura | serif 400 | 68px / 0.98 | `text-wrap: balance` |
| Titolo articolo | serif 400 | 54px / 1.0 | |
| Nome autore (pagina firma) | serif 400 | 60px / 0.95 | |
| Sommario / occhio | serif 400 *italic* | 20–21px / 1.35–1.4 | colore `#3a3323` |
| Titoli card archivio | serif 400 | 27px / 1.1 | |
| Corpo articolo | sans 400 | 17px / 1.68, `text-align: justify` | |
| Corpo colonne home | sans 400 | 15px / 1.62, justify, `hyphens: auto` | |
| Etichette di sezione | sans 600 | 11px, `letter-spacing:.16em`, uppercase | sopra filetto `2px solid ink` |
| Navigazione | sans 600 | 12px, `letter-spacing:.14em`, uppercase | |
| Metadati / punteggi | mono 500–600 | 10–12px, `letter-spacing:.1–.2em`, uppercase | |
| Capolettera | serif 400 | 62px / 0.78, `float:left`, `padding:5px 9px 0 0` | solo primo paragrafo dell'apertura |

Minimo: niente testo sotto 10px, e sotto i 12px solo monospace in maiuscolo.

---

## 4. Trama della carta

Tre livelli sovrapposti, nessuna immagine:

```css
/* 1 — macchie (foxing) + righe di torchio: sul contenitore pagina */
background-color: #efe6d2;
background-image:
  radial-gradient(120px 90px at 12% 8%,  rgba(150,116,58,.14), transparent 70%),
  radial-gradient(180px 120px at 88% 34%, rgba(150,116,58,.10), transparent 70%),
  radial-gradient(90px 70px at 30% 88%,  rgba(120,90,40,.12),  transparent 70%),
  repeating-linear-gradient(93deg, rgba(0,0,0,.018) 0 2px, transparent 2px 5px);

/* 2 — bordi ingialliti: figlio in position:absolute, inset:0, pointer-events:none */
box-shadow:
  inset 0 0 90px rgba(90,66,26,.28),
  inset 0 0 14px rgba(60,44,18,.25);
```

Le macchie vanno messe in posizioni diverse per ogni tipo di pagina (home, articolo, autore),
altrimenti si nota la ripetizione. L'angolo `93deg` delle righe è volutamente non perfetto:
simula la carta passata in macchina di sbieco.

Per rendere il tutto più o meno consumato basta scalare le opacità:
`.018 → .01` e `.28 → .15` per una carta più pulita, il doppio per una più sporca.

Immagini in mezzatinta seppia:

```css
filter: contrast(.92) sepia(.12);
/* segnaposto: repeating-linear-gradient(45deg,#ded3ba 0 3px,#cec2a6 3px 6px) */
```

---

## 5. Filetti e cornici

Il linguaggio da giornale sta quasi tutto nei bordi:

- `border-bottom: 4px double #1b1811` — chiude testata e nav, apre la sezione archivio.
- `border-bottom: 2px solid #1b1811` — sotto ogni etichetta di sezione.
- `border-bottom: 1px dotted rgba(27,24,17,.4)` — righe di elenco (tabellini, classifica, indice pezzi).
- `border-right: 1px solid rgba(27,24,17,.3)` — separatori tra colonne della home e tra card archivio.
- `column-rule: 1px solid rgba(27,24,17,.22)` — filetto tra le colonne di testo.
- Punteggi: fondo `#1b1811`, testo `#efe6d2`, `padding: 3px 7px`, **nessun** border-radius.

Regola generale: **zero angoli arrotondati** e **zero ombre morbide** dentro la pagina
(le ombre nel mockup sono solo la carta appoggiata sulla scrivania). L'unico tondo è l'avatar.

---

## 6. Struttura della homepage

```
┌ riga di testata: Anno IV · N. 8 | Lega Andre Chiurco | Prezzo ──────┐
├ TESTATA centrata + claim in corsivo tra due filetti ───────────────┤
├ nav a celle divise da 1px, chiusa da 4px double ───────────────────┤
├ 200px          │ colonna centrale (1fr)        │ 300px            ┤
│ "In breve"     │ occhiello rosso               │ I tabellini      │
│ 4 notizie      │ titolo 68px                   │ Classifica       │
│ brevi          │ sommario corsivo              │ box "Scrivi tu"  │
│                │ foto + didascalia             │                  │
│                │ testo su 2 colonne + capolet. │                  │
│                │ firma + "Continua a pagina 3" │                  │
├ "Dagli archivi" — 3 card divise da filetti verticali ──────────────┤
└ footer: "Pellegrini a 6..." + disclaimer ──────────────────────────┘
```

Griglia: `grid-template-columns: 200px 1fr 300px`, padding orizzontale `44px`, nessun gap
(la separazione la fanno i bordi delle colonne).

Mobile (< 768px): una colonna sola, testata a 30px centrata, spalle spostate sotto
l'articolo di apertura, testo giustificato mantenuto.

---

## 7. Mappa sui file esistenti

| File attuale | Cosa cambia |
|---|---|
| `layout.tsx` | font (vedi §2), `bg-paper text-ink`, rimozione classi `dark:` se si abbandona il tema scuro |
| `_components/intro.tsx` | diventa la **testata**: nome centrato in serif 92px + claim in corsivo tra filetti + riga "Anno IV · N. 8" |
| nuovo `_components/masthead-nav.tsx` | la nav a celle (Giornate / Squadre / Mercato / Firme / Archivio) |
| `_components/hero-post.tsx` | pezzo di apertura: occhiello, titolo 68px, sommario corsivo, foto + didascalia, corpo su due colonne, firma |
| nuovo `_components/sidebar-results.tsx` | tabellini + classifica (dati da un `_data/giornate.json` o dal frontmatter del post) |
| nuovo `_components/briefs.tsx` | colonna "In breve" |
| `_components/more-stories.tsx` | "Dagli archivi": griglia 3 colonne con filetti verticali, `gap-0` |
| `_components/post-preview.tsx` | card con occhiello mono rosso + titolo serif 27px + estratto giustificato |
| `_components/post-header.tsx` | titolo centrato 54px, sommario corsivo, riga autore con filetti sopra/sotto |
| `_components/post-body.tsx` + `markdown-styles.module.css` | corpo 17px/1.68 giustificato, `h3` in serif 26px, blocco tabellino, badge migliore/peggiore |
| `_components/avatar.tsx` | avatar 32–34px con `filter: sepia(.15)` |
| `_components/footer.tsx` | "Pellegrini a 6..." in serif 34px + disclaimer a destra, fondo `rgba(120,92,40,.06)` |
| nuovo `app/autori/[name]/page.tsx` | pagina firma: ritratto 120px, nome 60px, bio su due colonne, tre numeri, indice dei pezzi |
| `_components/theme-switcher.tsx` | da valutare: il tema scuro non regge la metafora carta. Si può togliere |
| `_components/alert.tsx` | eliminabile (barra "source code on GitHub" del template) |

Dati che oggi non esistono e servono per le spalle: risultati e classifica per giornata.
Nel mockup sono statici; nel sito conviene un `_data/giornate.json` letto da `lib/api.ts`,
oppure un blocco nel frontmatter del post della giornata.

---

## 8. Ordine di lavoro suggerito

1. Font + palette + fondo carta in `layout.tsx` e `tailwind.config.ts`.
2. Testata e nav (`intro.tsx`, nuovo `masthead-nav.tsx`).
3. Griglia a tre colonne della home con l'apertura al centro.
4. Stili del corpo articolo (`markdown-styles.module.css`) + blocchi tabellino e migliore/peggiore.
5. Card archivio e footer.
6. Pagina autore.
7. Dati di giornata per tabellini e classifica.
