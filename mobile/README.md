# MetroCity AI mobile app

Built with Expo SDK 57 and targeted for Android 7/API 24 and newer, including the Samsung Galaxy A13 class of devices. Expo SDK 57 uses React Native 0.86 and React 19.2.3; use Node.js 22.13 or newer for the current SDK toolchain.

Expo app for the Nalasopara citizen and municipal admin experiences. On launch, choose a role. The web dashboard is also available as the larger protected admin console. It includes:

- road-priority dashboard with synthetic-data labeling;
- road register and GIS-style pilot-area preview;
- citizen road-issue submission flow with an interactive map, GPS pin, photo evidence, and offline queue;
- citizen report tracking, repair evidence review, and confirm-fixed/reopen actions;
- a separate mobile admin workspace with a protected issue queue, map, assignment, evidence, and status controls;
- Road Passport timeline with explainability notes;
- worker evidence queue and emergency alerts;
- optional FastAPI integration through `EXPO_PUBLIC_API_URL`.

## Run

```bash
cd mobile
npm install
npm start
```

For an installable APK for device testing:

```bash
npx eas build --profile preview --platform android
```

For a Play Store bundle:

```bash
npx eas build --profile production --platform android
```

For a physical device, set the backend to a LAN-reachable URL, for example:

```bash
$env:EXPO_PUBLIC_API_URL = "http://192.168.1.20:8000"
npm start
```

Start FastAPI so the phone can reach it:

```bash
cd ../backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Use the laptop's IPv4 address, not the phone's address. The default
`http://10.0.2.2:8000` is only for an Android emulator. The laptop and phone
must be on the same Wi-Fi network, and Windows Firewall must allow Python on
private networks.

The app falls back to synthetic demo records if the API is unavailable. Demo records must not be presented as verified municipal data.

## Demo roles

- Citizen mobile token: handled automatically by the Expo app (`demo-citizen-token`)
- Admin web token: `demo-admin-token`
- Admin demo login: `admin@metrocity.gov` / `admin123`
- Citizen demo login: `citizen@metrocity.app` / `citizen123`

The Expo role chooser is a demo convenience. Selecting Citizen opens the citizen map/report experience; selecting Municipal admin opens the admin operations experience.

The current authentication is intentionally demo-only and in-memory. Replace it with a real identity provider and database before production deployment.
