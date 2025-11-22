Free4Talk - Fullstack ZIP

Contents:
- frontend/  (Vite + React app)
- server/    (Node + Express + Socket.IO server)

Quick local run

1) Frontend
--------------
cd frontend
npm install
npm run dev
Open http://localhost:5173

2) Server
---------
cd server
npm install
node server.js
Server listens on port 3001 by default.

Deploying to a server (Visual Studio / Azure)
---------------------------------------------
- Frontend:
  - Build: cd frontend && npm install && npm run build
  - Serve the output in `dist/` from any static host (Azure Static Web Apps, Netlify, Vercel).
  - Alternatively serve via Express by copying `dist` into a server folder.

- Server (Node):
  - Deploy `server/` to any Node host (Azure App Service, DigitalOcean App Platform, Railway).
  - In Azure App Service: create Node app, push this folder, run `npm install`, set PORT app setting, start `node server.js`.
  - Make sure CORS origin for Socket.IO is set to your frontend origin in production.

Notes on WebRTC / TURN
----------------------
- For reliable voice across NATs, add a TURN server (coturn) and include it in RTC configuration.
- This repo includes signaling via Socket.IO; you still need to implement client WebRTC getUserMedia and RTCPeerConnection logic in the frontend for real voice.

If you want, I can:
- Add socket.io-client integration into the frontend and UI to connect to the server.
- Provide a one-click Azure deployment guide.
