# Agenda Sync BaaS – Piano di Sviluppo

## Regole di Sviluppo Obbligatorie (Flusso Git)

Per ogni task di implementazione (dalla **Fase 3** alla **Fase 6**) è obbligatorio seguire questa sequenza.

1. Creazione del **feature branch** partendo da `develop`.
2. Sviluppo del task.
3. Eventuali test del task.
4. Salvataggio delle modifiche:

   ```bash
   git add .
   ```

5. Commit:

   ```bash
   git commit -m "messaggio del commit"
   ```

6. Push del branch remoto:

   ```bash
   git push -u origin <nome-branch>
   ```

7. Apertura della **Pull Request** verso `develop`.
8. Merge della Pull Request.
9. Allineamento del branch locale:

   ```bash
   git checkout develop
   git pull origin develop
   ```

10. Eliminazione del feature branch locale e remoto.

> **Nota**
>
> I commit diretti sui branch `main` e `develop` sono severamente vietati.

---

# Fase 1 – Analisi e Design

## Task 1.1 – Inizializzazione Repository

- Creazione repository GitHub.
- Nome repository:
  ```
  Agenda-Sync-BaaS
  ```
- Descrizione:
  > Genera una descrizione professionale di circa 300 caratteri.
- Clonazione locale tramite HTTPS.
- Creazione dei branch:
  - `main`
  - `develop`

> **Nota**
>
> Per questo task **non è necessario** creare un feature branch dedicato.

---

## Task 1.2 – Configurazione Firebase

- Creazione del progetto su Firebase Console.
- Abilitazione di:
  - Firebase Authentication (Email/Password)
  - Cloud Firestore

---

## Task 1.3 – Progettazione UI/UX

Definizione della struttura dell'interfaccia seguendo i principi della **Bento UI**:

- layout a griglia;
- angoli arrotondati;
- forte contrasto visivo;
- definizione della palette colori.

---

## Task 1.4 – Modellazione Dati

Definizione dello schema JSON dei documenti Firestore.

Collezioni previste:

- Utenti
- Task Privati
- Calendari Condivisi
- Task Fissi

---

## Task 1.5 – Configurazione Variabili d'Ambiente

Definizione della gestione dei segreti Firebase.

Creare:

- `.env` (non versionato)
- `.env.example` (versionato)

Esempio:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=insert_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=insert_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=insert_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=insert_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=insert_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=insert_app_id
```

Installazione Firebase:

```bash
npm install firebase
```

Configurazione:

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
```

---

## Task 1.6 – Firestore Security Rules

Progettazione delle Firestore Security Rules.

Obiettivi:

- ogni utente può leggere e modificare esclusivamente i propri documenti privati;
- ogni utente può accedere soltanto ai calendari condivisi in cui è autorizzato.

---

# Fase 2 – Inizializzazione Progetto

## Task 2.1 – Setup Expo

Creazione del progetto React Native tramite Expo CLI.

---

## Task 2.2 – Installazione Dipendenze

Installazione delle librerie necessarie:

- Firebase SDK
- React Navigation
- componenti UI

Per supportare la preview nel browser installare anche:

```bash
npm install react-native-web react-dom
```

---

# Fase 3 – Implementazione: Autenticazione e Navigazione

## Task 3.1 – Autenticazione

Realizzazione delle schermate:

- Login
- Registrazione

Campi richiesti:

- username
- email
- password
- data di nascita

Integrazione con Firebase Authentication.

---

## Task 3.2 – Navigazione

Configurazione di React Navigation.

Implementazione dello swipe orizzontale tra:

- area privata;
- area condivisa.

Ogni area dovrà avere un colore differente.

Definizione di uno stato globale tramite:

- React Context API
- oppure Zustand

Lo stato dovrà contenere:

- utente autenticato;
- ID del calendario condiviso attivo.

---

# Fase 4 – Implementazione: Calendario Privato

## Task 4.1 – UI Area Privata

Realizzazione di:

- homepage centrata sul giorno corrente;
- calendario mensile completo;
- navigazione tramite Sidebar o Bottom Navigation.

---

## Task 4.2 – CRUD Task Privati

Implementazione delle operazioni:

- Creazione
- Lettura
- Modifica
- Eliminazione

Caratteristiche:

- scelta del colore del task;
- persistenza offline automatica di Firestore.

---

## Task 4.3 – Eventi Ricorrenti

Realizzazione dell'interfaccia per:

- creare eventi ricorrenti;
- inserimento batch su più date.

Lo stato globale dovrà mantenere:

- utente autenticato;
- calendario condiviso attivo.

---

# Fase 5 – Implementazione: Calendario Condiviso

## Task 5.1 – OTP e Condivisione

Realizzazione della logica per:

- creare un calendario condiviso;
- usare l'ID del documento Firestore come codice OTP;
- inserire un codice OTP ricevuto.

---

## Task 5.2 – UI Area Condivisa

Creazione di una sezione identica a quella privata ma:

- con colori differenti;
- indipendente dalla sezione privata.

Implementazione della sincronizzazione realtime tramite Firestore.

---

# Fase 6 – Implementazione: Notifiche In-App (Area Condivisa)

## Task 6.1 – Trigger e Generazione Notifiche

- Creazione della funzione di utilità per inviare notifiche in-app agli altri membri di un calendario condiviso.
- Generazione automatica di un record in `inapp_notifications` alla creazione, modifica o eliminazione di un task condiviso.
- Generazione notifiche in-app durante l'inserimento batch di task fissi.

## Task 6.2 – Visualizzazione e Navigazione

- Integrazione della campanella (`CampanellaNotifiche.js`) negli header dell'area condivisa.
- Conteggio in tempo reale delle notifiche non lette.
- Navigazione diretta alla data dell'evento quando si clicca su una notifica.
- Funzione di svuotamento singolo o globale delle notifiche.

---

# Fase 7 – Refactoring e Testing

Task 7.1 – Refactoring e Riorganizzazione Architetturale

1. Applicazione Principio DRY e Componentizzazione
   - Unificazione delle card di visualizzazione task private e condivise in un singolo componente riutilizzabile.
   - Accorpamento delle modali di creazione/modifica task in un unico modulo configurabile tramite prop.
   - Unificazione delle modali di dettaglio della singola giornata del calendario.

2. Disaccoppiamento e Separazione degli Stili
   - Estrazione di tutti i blocchi StyleSheet.create dai file di logica/interfaccia (.js).
   - Creazione di file di stile dedicati (es. Componente.stili.js) per isolare completamente il design visuale dal codice applicativo.
   - Centralizzazione della gestione dei temi, dei colori e degli sfondi per consentire modifiche grafiche globali immediate.

3. Riorganizzazione dei File e Nomenclatura
   - Rinominazione di file e cartelle utilizzando esclusivamente nomi in italiano descrittivi della funzione (es. navigazione/, schermate/, componenti/, servizi/).
   - Ristrutturazione della gerarchia delle cartelle secondo la preferenza e la logica di consultazione definita dal developer.

4. Pulizia e Ottimizzazione Codice
   - Eliminazione di import non utilizzati, variabili inutilizzate e codice duplicato.
   - Revisione della Bento UI per garantire omogeneità visiva tra sezione privata e condivisa.

## Task 7.2 – Testing Funzionale

Verifica di:

- login;
- registrazione;
- navigazione;
- notifiche push.

---

## Task 7.3 – Testing Offline

Procedura:

1. attivare la modalità aereo;
2. creare task offline;
3. disattivare la modalità aereo;
4. verificare la sincronizzazione automatica con Firestore.

---

# Fase 8 – Deployment

## Task 8.1 – Configurazione App

Aggiornamento di `app.json`:

- nome applicazione;
- icona;
- splash screen;
- permessi Android.

---

## Task 8.2 – Build APK

Expo ha deprecato la generazione completamente locale degli APK.

Utilizzare **EAS Build**.

Configurazione:

```bash
npm install -g eas-cli
```

```bash
eas login
```

```bash
eas build:configure
```

Generazione APK:

```bash
eas build -p android --profile preview
```

---

## Task 8.3 – Collaudo Finale

- installazione manuale dell'APK sul telefono;
- verifica delle prestazioni;
- verifica della reattività dell'app.

---

# Vincoli, Problemi e Considerazioni

## Ambiente di sviluppo

1. PC Windows con macchina virtuale Hyper-V Ubuntu.
2. IDE consigliato: Visual Studio Code.
3. La VM impedisce l'utilizzo affidabile dei dispositivi USB.
4. I test UI verranno effettuati principalmente tramite:

```bash
npx expo start --web
```

che renderizza l'app direttamente nel browser.

5. Il test finale sul dispositivo fisico avverrà esportando l'APK e trasferendolo tramite WhatsApp.

---

# Attività Mancanti

Attualmente il piano richiede ancora l'implementazione di:

- gestione completa delle Firestore Security Rules;
- gestione corretta delle variabili d'ambiente;
- configurazione di Expo Web per i test UI nella VM;
- task dedicato alla stesura definitiva delle Firestore Security Rules.
