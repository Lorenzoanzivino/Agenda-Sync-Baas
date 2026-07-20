# Specifiche UI/UX - Agenda-Sync-BaaS

## Principi Bento UI

- **Layout a Griglia:** Implementato tramite Flexbox nativo (`flexDirection`, `flexWrap`, `gap`).
- **Spaziature (Base 8px):**
  - Padding interno card: `16px` o `24px`
  - Gap tra elementi: `16px`
  - Margine globale schermata: `24px`
- **Bordi (Border Radius):**
  - Card principali (giorno corrente): `24px`
  - Task singoli/Bottoni: `12px` o `16px`
- **Stile:** Flat, assenza di ombre complesse. Contrasto generato dal colore di sfondo rispetto alle card.

## Gestione dello Stile in React Native

I seguenti valori non devono mai essere hardcoded nei componenti. Verranno esportati da un file centrale `src/constants/theme.js` e applicati tramite `StyleSheet` nativo.

## Palette Colori

### Area Privata

- **Sfondo Schermata:** `#F2F2F7` (Grigio chiarissimo)
- **Sfondo Card:** `#FFFFFF` (Bianco puro)
- **Colore Primario (Icone/Testi chiave):** `#0A84FF` (Blu)
- **Testo Principale:** `#1C1C1E` (Grigio scuro)
- **Testo Secondario:** `#8E8E93` (Grigio medio)

### Area Condivisa

- **Sfondo Schermata:** `#FFF3E0` (Beige pastello)
- **Sfondo Card:** `#FFFFFF` (Bianco puro)
- **Colore Primario (Icone/Testi chiave):** `#FF9500` (Arancione)
- **Testo Principale:** `#1C1C1E` (Grigio scuro)
- **Testo Secondario:** `#8E8E93` (Grigio medio)
