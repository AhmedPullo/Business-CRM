Business CRM — Mobile (Expo)

This is a lightweight Expo + React Native scaffold that mirrors the existing web front-end in dev mode (no auth). The mobile app talks to the existing Node.js backend API endpoints.

Quick start (Windows PowerShell):

```powershell
cd "c:\Users\DELL\Documents\projet_after_ing\papou\replit\Business-CRM\mobile"
npm install
npx expo start
```

Important notes:
- The backend BASE_URL is configured in `app.json` under `expo.extra.BASE_URL` (default is `http://192.168.1.100:3000`). Replace that with your machine LAN IP where the backend runs so the mobile app on a device/emulator can reach it.
- This scaffold is in "dev-mode" without authentication. You can integrate auth later (see project notes).

What I created: minimal app skeleton with navigation, a few screens and API hooks that use the same endpoints as the web client.
