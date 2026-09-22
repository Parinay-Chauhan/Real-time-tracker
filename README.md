# Real-Time Location Tracker

A browser-based, multi-user location tracker built with Node.js, Express, Socket.IO, Leaflet, and OpenStreetMap. Each connected user can share their device location in real time and see the latest recorded locations on a shared map.

> This application uses the browser's Geolocation API. Users must explicitly grant location permission before their position can be shared.

## Features

- Live location updates using Socket.IO
- Interactive map powered by Leaflet and OpenStreetMap tiles
- Automatic map centering on incoming location updates
- One marker per connected browser session
- Markers remain on the map after a client disconnects, preserving the last known location
- Responsive, browser-native geolocation support

## Technology Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Server | Express 5 |
| Real-time communication | Socket.IO |
| Views | EJS |
| Map library | Leaflet |
| Map tiles | OpenStreetMap |

## Project Structure

```text
.
├── app.js              # Express and Socket.IO server
├── public/
│   ├── css/style.css   # Page styles
│   └── js/script.js    # Geolocation, map, and marker logic
├── views/index.ejs     # Main map page
├── .env                # Local environment values (not committed)
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A browser that supports the Geolocation API

Location access works on `localhost` during development. On a deployed site, use HTTPS; browsers generally block geolocation on unsecured HTTP pages.

## Local Setup

1. Clone the repository and open the project directory.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   PORT=5000
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. Open [http://localhost:5000](http://localhost:5000) in one or more browser windows, allow location access, and move or simulate a location to see updates.

## How It Works

1. The browser starts `navigator.geolocation.watchPosition()` after the user grants permission.
2. Each coordinate update is emitted to the server through Socket.IO as `send-location`.
3. The server broadcasts the update to all connected clients.
4. Every browser creates or updates the corresponding marker on its Leaflet map.
5. When a user disconnects, their latest marker intentionally remains visible.

## Socket Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `send-location` | Client → Server | Sends a user's latitude and longitude. |
| `receive-locatoin` | Server → Clients | Broadcasts a location update with the socket ID. |
| `user-disconnect` | Server → Clients | Announces a disconnected socket. The current client intentionally does not remove its marker. |

> `receive-locatoin` is retained as the event name for compatibility with the existing client and server implementation.

## Deploying to Render

This project must be deployed as a **Render Web Service**, not a Static Site, because Socket.IO requires a running Node.js server and persistent WebSocket connections.

1. Push the project to a Git repository.
2. In Render, select **New → Web Service** and connect the repository.
3. Use these settings:

   | Setting | Value |
   | --- | --- |
   | Runtime | Node |
   | Build Command | `npm ci` |
   | Start Command | `npm start` |

4. Create the service and open the generated `onrender.com` URL.

Render supplies the `PORT` environment variable automatically. The application falls back to port `3000` only when `PORT` is not defined.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Local HTTP port. Render sets this automatically in production. |

Never commit `.env` files. The repository's `.gitignore` excludes them by default.

## Privacy and Production Considerations

- Obtain informed user consent before collecting or displaying location data.
- This project broadcasts location data to every connected client; it has no authentication, authorization, or user-specific rooms.
- Marker data is held only in connected browser memory. It is not stored in a database and disappears when a page reloads.
- For production use, add authentication, access controls, HTTPS, a privacy policy, server-side validation, rate limiting, and persistent storage if required.

## License

This project is licensed under the ISC License. See `package.json` for details.
