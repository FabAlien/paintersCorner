# 10. Making it a PWA

[← Statistics](09-statistics.md) · [Guide index](README.md) · Next: [Styling →](11-styling.md)

The [README](../README.md#idea) says the app should be installable on a phone, so you can check your collection while you're in the shop. A **progressive web app** needs three things:

1. **HTTPS** (or `localhost`).
2. A **web app manifest**: a JSON file with the name, icons and colours used when the app is installed.
3. A **service worker**: a script that caches the app's files so it opens without internet.

Writing a service worker by hand is fiddly. [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) generates both the manifest and the service worker for you.

## When to do this

It's best to do this **after** the main features work. Service-worker caching can make debugging confusing, because you might be looking at an old cached version. Plan for the PWA from the start, though: [localStorage](04-data-and-storage.md#saving-with-uselocalstorage) already works offline, and a [bundled paint dataset](06-paint-inventory.md#step-0-choose-a-data-source) would make search work offline too.

## Setup

```bash
npm install -D vite-plugin-pwa
```

```js
// vite.config.js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: "Painter's Corner",
        short_name: 'Painters',
        description: 'Track your miniature paints, hobby materials and shopping list',
        theme_color: '#1e1e2e',
        background_color: '#1e1e2e',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
```

Choose the colours to match your design ([Styling](11-styling.md)).

### Icons

Put the PNG icons in [`public/`](../public/). You can generate them from [`public/favicon.svg`](../public/favicon.svg), or from a better logo, using the [`@vite-pwa/assets-generator`](https://vite-pwa-org.netlify.app/assets-generator/) tool or any online "PWA icon generator". A *maskable* icon needs extra padding around the logo, because Android crops it into different shapes.

### `index.html`

Add these to `<head>` in [`index.html`](../index.html), and fix the title while you're there:

```html
<title>Painter's Corner</title>
<meta name="theme-color" content="#1e1e2e" />
<link rel="apple-touch-icon" href="/pwa-192x192.png" />
```

## Testing

The service worker is **off in `npm run dev`** by default. To test the real thing:

```bash
npm run build
npm run preview
```

In Chrome DevTools → **Application**:

- **Manifest** shows any problems with the manifest and icons.
- **Service workers** shows whether it is registered. Tick *Offline* and reload: the app should still load.
- **Lighthouse** → *PWA* checks everything at once.

If you see an old version, click *Unregister* under Service workers, or use *Clear site data*.

### Data from the API while offline

The plugin caches your own app files automatically. Responses from an **external paint API** are not cached. You can either:

- accept that search needs internet, and show a clear "You're offline" message (the error state in [PaintSearch](06-paint-inventory.md#search-component)),
- add `workbox.runtimeCaching` rules in the plugin config to cache API responses (see the plugin docs), or
- use a bundled dataset, which works offline with no extra work.

The user's own inventory, materials and shopping list are in `localStorage`, so they **always** work offline.

## Testing on your phone

A phone can't open your computer's `localhost`, and `http://192.168.x.x:5173` is **not** a secure context. That means the service worker won't register, and [`crypto.randomUUID()`](04-data-and-storage.md#ids) won't work. Your options:

- **Deploy it** (easiest). Free static hosts like Netlify, Vercel, Cloudflare Pages or GitHub Pages serve over HTTPS. The build command is `npm run build` and the output folder is `dist`.
- **USB port forwarding**. On Android with Chrome, `chrome://inspect` → *Port forwarding* makes your computer's `localhost:4173` available as `localhost` on the phone.
- For quick layout checks only, `npm run dev -- --host` and open the printed network URL. Expect the PWA features to be missing.

## Updates

With `registerType: 'autoUpdate'`, the new version is installed in the background and used the next time the app opens. If you'd rather show a "New version available, reload?" message, see *Prompt for update* in the plugin docs.

---

Next: [Styling →](11-styling.md)
