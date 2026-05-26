## Cíl
Moderní, elegantní webová prezentace pro **I&E Tile Services** (výroba a realizace koupelen) v tmavém luxusním stylu s černou + zlatou paletou. Dvojjazyčný (CZ/EN) s přepínačem.

## Vizuální směr
- Paleta: `#0d0d0d`, `#1a1a1a`, zlato `#c9a84c`, světlé zlato `#f0d78c`, off-white text
- Typografie: serifový display font na headlines (např. Cormorant / Playfair) + sans-serif body (Inter / Manrope) — luxusní editorial vibe
- Hodně whitespace, jemné zlaté linky, hover přechody, scroll-reveal animace
- Logo "I&E" jako monogram v rámečku (čistá typografická značka) v headeru a footeru

## Struktura (samostatné routes + SEO meta na každé)
- `/` — Domů: hero ("Koupelny na míru"), USP, ukázka realizací, CTA na poptávku
- `/sluzby` (`/services`) — Služby: výroba koupelen, obklady/dlažba, návrh, instalace, renovace
- `/galerie` (`/gallery`) — Mřížka realizací (placeholder obrázky teď, swap později)
- `/cenik` (`/pricing`) — Orientační ceník (3–4 balíčky + položkový ceník)
- `/reference` (`/testimonials`) — Recenze klientů
- `/o-nas` (`/about`) — Příběh firmy, hodnoty, tým
- `/kontakt` (`/contact`) — Kontaktní formulář, adresa, telefon, mapa placeholder

## Dvojjazyčnost (CZ/EN)
- Lightweight i18n: vlastní `LanguageProvider` (React context) + slovníky `cs.ts` / `en.ts` v `src/i18n/`
- Přepínač CZ/EN v headeru, volba uložená v `localStorage`
- Výchozí jazyk: CZ
- Bez routovaných prefixů (`/en/...`) — drží to jednoduché; texty se přepínají klientsky

## Komponenty
- `SiteHeader` (logo I&E, nav, language switcher, mobile drawer)
- `SiteFooter` (kontakt, sociální, copyright)
- `Hero`, `ServiceCard`, `GalleryGrid`, `PricingCard`, `TestimonialCard`, `ContactForm`
- Sdílené layout přes `__root.tsx` (header + Outlet + footer)

## Technické detaily
- TanStack Start file-based routing v `src/routes/`
- Design tokens v `src/styles.css` (oklch) — přepsat `--background`, `--foreground`, `--primary` (zlatá), `--accent`, přidat `--gradient-gold`, `--shadow-gold`
- Fonty přes Google Fonts `<link>` v `__root.tsx` head
- Obrázky: neutrální placeholdery (gradient bloky se zlatou linkou + popisek) — připraveno na pozdější swap
- Formulář kontaktu: zatím client-side (mailto nebo "děkujeme" toast) — backend lze přidat později přes Lovable Cloud
- SEO `head()` na každé route s vlastním title/description/og

## Co tento plán NEzahrnuje
- Backend / databáze (žádné Lovable Cloud zatím)
- Skutečné odesílání e-mailů z formuláře
- Reálné fotky realizací (placeholders)
- Admin / CMS pro správu galerie

Pokud něco z výše chceš zařadit, dej vědět — jinak po schválení začnu stavět.