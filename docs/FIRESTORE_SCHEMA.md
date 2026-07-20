# Modelli Dati Cloud Firestore - Agenda-Sync-BaaS

Struttura piatta NoSQL basata su collezioni indipendenti alla radice (root).

## 1. Collezione `users`

- **ID Documento:** UID generato da Firebase Auth (`auth.uid`).

```json
{
  "uid": "abc123xyz",
  "username": "utente_demo",
  "email": "demo@example.com",
  "birthDate": "1990-01-01",
  "pushToken": "ExponentPushToken[xxxxxx]",
  "createdAt": "2026-07-20T10:00:00Z"
}
```

## 2. Collezione private_tasks

- **ID Documento:** Auto-generato da Firestore.

```json
{
  "id": "task_xyz789",
  "userId": "abc123xyz",
  "title": "Appuntamento Medico",
  "date": "2026-07-21",
  "color": "#0A84FF",
  "isCompleted": false,
  "createdAt": "2026-07-20T10:05:00Z"
}
```

## 3. Collezione shared_calendars

- **ID Documento:** Stringa breve univoca generata manualmente (es. 6 caratteri alphanumeric) che funge da codice OTP.

```json
{
  "id": "X7Y9Z",
  "name": "Calendario Lavoro",
  "ownerId": "abc123xyz",
  "members": ["abc123xyz", "def456uvw"],
  "createdAt": "2026-07-20T10:10:00Z"
}
```

## 4. Collezione shared_tasks

- **ID Documento:** Auto-generato da Firestore.

```json
{
  "id": "stask_lmn123",
  "calendarId": "X7Y9Z",
  "createdBy": "def456uvw",
  "title": "Riunione di progetto",
  "date": "2026-07-22",
  "color": "#FF9500",
  "isCompleted": false,
  "createdAt": "2026-07-20T10:15:00Z"
}
```

## 5. Collezione fixed_tasks

- **ID Documento:** Auto-generato da Firestore.

```json
{
  "id": "fixed_789",
  "userId": "abc123xyz",
  "title": "Turno Mattina",
  "defaultColor": "#34C759",
  "createdAt": "2026-07-20T10:20:00Z"
}
```
