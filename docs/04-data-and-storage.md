# 4. Data model and storage

[← Architecture](03-architecture.md) · [Guide index](README.md) · Next: [Tab navigation →](05-navigation.md)

Decide what your data looks like **before** you build the screens. Every tab reads and writes these shapes, so changing them later means changing a lot of code.

## Paint

A paint the user owns, based on data from the paint API (see [Paint inventory](06-paint-inventory.md)):

```js
{
  id: 'b3f1…',              // our own id (see "Ids" below)
  sourceId: 'citadel-abaddon-black', // id from the API, used to avoid duplicates
  brand: 'Citadel',          // manufacturer
  range: 'Base',             // paint range
  code: null,                // paint code, if the brand uses codes (e.g. Vallejo '70.950')
  name: 'Abaddon Black',
  hex: '#231f20',            // colour, for the swatch
  quantity: 1,               // number of pots owned
}
```

The README requires each paint to have a **manufacturer, paint range, code and colour**. Those are `brand`, `range`, `code` and `hex` here.

## Material

Hobby materials are free-form ([Hobby materials](07-hobby-materials.md)). The only required field is the name:

```js
{
  id: '9ac2…',
  name: 'Size 0 detail brush',
  categoryId: 'c1…',         // or null for "Uncategorised"
  quantity: 0,               // 0 is allowed!
  notes: 'Kolinsky sable',
  fields: [                  // user-defined extra info
    { label: 'Brand', value: 'Winsor & Newton' },
    { label: 'Price', value: '150 kr' },
  ],
}
```

## Category

```js
{ id: 'c1…', name: 'Brushes' }
```

Materials store only the `categoryId`, so renaming a category automatically updates every item in it.

## Shopping list item

Paints and materials can both go on the shopping list ([Shopping list](08-shopping-list.md)). Each item stores a **snapshot** of what to show, plus a link back to where it came from:

```js
{
  id: 'f00d…',
  kind: 'paint',             // 'paint' | 'material'
  refId: 'b3f1…',            // id of the paint/material, or null for a paint not in inventory yet
  name: 'Abaddon Black',
  details: 'Citadel · Base', // short text shown under the name
  hex: '#231f20',            // paints only (optional)
  paint: { /* full paint object */ }, // paints only: lets you add it to the inventory after buying
  quantity: 1,
  bought: false,             // the checkbox
}
```

Why keep a snapshot and not just `refId`? Because you may want to buy a paint you **don't own yet**, for example one you found with the search. You'll also want the list to keep showing the item correctly even if it is later deleted from the inventory.

## Statistics events

To show lifetime usage ([Statistics](09-statistics.md)), you have to **record history while it happens**. You can't rebuild it later. Keep an append-only log:

```js
{
  type: 'purchased',         // 'purchased' | 'paint-added' | 'material-added' | 'used-up' ...
  kind: 'paint',
  name: 'Abaddon Black',
  quantity: 1,
  date: '2026-11-05T14:03:00.000Z',
}
```

## Ids

Every item needs a stable, unique id. It is used for React [list keys](02-react-basics.md#lists-and-keys) and for finding the item when you update or remove it. Browsers have a built-in id generator:

```js
const id = crypto.randomUUID()
```

> `crypto.randomUUID()` only works in a *secure context*, which means HTTPS or `localhost`. Both the dev server and a deployed PWA are secure contexts, so this is fine. If you open the dev server from your phone through your computer's IP address, though, it won't be. See [Making it a PWA](10-pwa.md#testing-on-your-phone).

## Saving with `useLocalStorage`

Without saving, everything disappears when the page reloads. `localStorage` is the simplest fix: it works offline, which matters for a [PWA](10-pwa.md), and it's enough for one user on one device.

Create `src/hooks/useLocalStorage.js`:

```js
import { useEffect, useState } from 'react'

export default function useLocalStorage(key, initialValue) {
  // The function form runs only on the first render, so we don't re-read storage every time
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  // Whenever the value changes, write it back
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

You use it exactly like `useState`:

```js
const [paints, setPaints] = useLocalStorage('pc.paints', [])
```

### Storage keys

Give every key the same prefix so they don't clash with anything else on `localhost`:

| Key              | Contents                  |
| ---------------- | ------------------------- |
| `pc.paints`      | Array of paints           |
| `pc.materials`   | Array of materials        |
| `pc.categories`  | Array of categories       |
| `pc.shopping`    | Array of shopping items   |
| `pc.stats`       | Array of stats events     |

### If you change the data shape later

Old data saved in someone's browser keeps the old shape. While you're developing, you can clear it in DevTools → *Application* → *Local Storage*. After people start using the app, add a version number (for example `pc.version`) and write a small function that upgrades old data when the app starts.

### Limits

`localStorage` holds about 5 MB of text for each site. That is plenty for thousands of paints. You'll only need something bigger (IndexedDB, or a backend with user accounts so data can sync between phone and computer) if you later add photos or syncing. That is outside the scope of the current [README](../README.md).

---

Next: [Tab navigation →](05-navigation.md)
