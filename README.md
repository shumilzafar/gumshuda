# Gumshuda — Campus Lost & Found

An Expo (React Native) app for UET Lahore. Students post found items, owners
browse, search, and claim them.

## Run it

1. Install Node.js 18 or newer on your laptop.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npx expo start
   ```

4. Install **Expo Go** on your Android phone, connect the phone to the same
   Wi-Fi as the laptop, and scan the QR code shown in the terminal.

The app opens instantly on the phone. Shake the phone to open the dev menu
(reload, debug).

## How it works (v1)

- No backend yet. Items are stored on the phone with AsyncStorage and seeded
  with 8 example UET items on first launch.
- The real version plugs in Firebase (phone auth, Firestore, Storage, push
  notifications). All data access lives in `lib/store.js`, so swapping the
  backend means rewriting one file. The screens stay the same.

## Project layout

- `app/(tabs)/index.jsx` — Browse feed with search and category filters
- `app/(tabs)/post.jsx` — Post a found item (camera or gallery photo)
- `app/(tabs)/mine.jsx` — My posts, mark returned, delete
- `app/item/[id].jsx` — Item detail and the claim flow
- `lib/store.js` — AsyncStorage CRUD plus a timeAgo helper
- `lib/seed.js` — 8 realistic UET seed items
- `lib/theme.js` — colors, categories, category icons

## Building an APK later

When the app is ready to share outside Expo Go:

```bash
npx expo install expo-dev-client
eas build --platform android --profile preview
```

That needs a free Expo account. Play Store publishing needs a signed
release build plus a $25 one-time Google Play developer account.
