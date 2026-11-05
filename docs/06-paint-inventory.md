# 6. Paint inventory

[← Tab navigation](05-navigation.md) · [Guide index](README.md) · Next: [Hobby materials →](07-hobby-materials.md)

From the [README](../README.md#paint-inventory):

> Paint information is fetched from an API.
> - **Adding paints** – find a paint with the search function, or, for some brands, just enter the paint code.
> - **Paint details** – each paint has a manufacturer, paint range, code and colour.

## Step 0: choose a data source

**No paint API has been chosen yet.** That is the first decision to make for this feature. Look for:

- **Coverage**: the brands the users actually paint with (Citadel, Vallejo, Army Painter, AK, Scale75…).
- **The fields you need**: brand, range, code, name and colour (a hex value or RGB).
- **Access**: is it free, does it need an API key, does it allow requests from a browser (CORS), and are there rate limits?
- **Licence**: are you allowed to use the data in your app?

There are two realistic approaches:

| Approach | Pros | Cons |
| --- | --- | --- |
| **A hosted API** you `fetch` from | Always up to date, small app | Needs internet; may need a key, have CORS problems or go offline for good |
| **An open dataset** (e.g. a JSON/CSV file on GitHub) that you download, convert to JSON and put in the project or `public/` | Works **offline** (great for a [PWA](10-pwa.md)), no keys, no CORS, fast search | You must update it yourself; the app gets bigger |

Community-maintained open paint datasets exist on GitHub (search for "miniature paints" datasets). Check what licence and fields any candidate has before you use it. Write down what you chose, and why, at the top of `src/services/paintApi.js` so the next person knows.

Whichever approach you choose, **use the structure below**. Then switching later only means changing one file.

## Keep the API in one file

Components should never call `fetch` directly. Put everything to do with the data source in `src/services/paintApi.js`, and make it return paints in **our own** shape ([Data model → Paint](04-data-and-storage.md#paint)):

```js
// src/services/paintApi.js
// Data source: <write which API/dataset you chose and why>

const BASE_URL = 'https://example.com/api' // placeholder: replace with the real API

// Convert whatever the API returns into our shape
function toPaint(raw) {
  return {
    sourceId: String(raw.id),
    brand: raw.manufacturer,
    range: raw.range,
    code: raw.code ?? null,
    name: raw.name,
    hex: raw.hex,
  }
}

export async function searchPaints(query, { signal } = {}) {
  const res = await fetch(`${BASE_URL}/paints?search=${encodeURIComponent(query)}`, { signal })
  if (!res.ok) throw new Error(`Search failed (${res.status})`)
  const data = await res.json()
  return data.map(toPaint)
}

export async function findPaintByCode(brand, code) {
  const res = await fetch(`${BASE_URL}/paints?brand=${encodeURIComponent(brand)}&code=${encodeURIComponent(code)}`)
  if (!res.ok) throw new Error(`Lookup failed (${res.status})`)
  const data = await res.json()
  return data.length > 0 ? toPaint(data[0]) : null
}
```

If you use a local dataset, these two functions keep the same names and simply search an imported array, so no component needs to change:

```js
import allPaints from '../data/paints.json'

export async function searchPaints(query) {
  const q = query.trim().toLowerCase()
  return allPaints.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 50)
}
```

> **API keys:** Anything in frontend code can be read by anyone who opens DevTools. If the API needs a **secret** key, you need a small backend to hide it. If the key is meant to be public, put it in a `.env.local` file as `VITE_PAINT_API_KEY=...` and read it with `import.meta.env.VITE_PAINT_API_KEY`. `.env.local` is already ignored by git because of `*.local` in [`.gitignore`](../.gitignore).

## Search component

This is a search box that waits until the user stops typing, then fetches. It also cancels old requests, so slow responses can't overwrite newer ones:

```jsx
// src/features/inventory/PaintSearch.jsx
import { useEffect, useState } from 'react'
import { searchPaints } from '../../services/paintApi'

function PaintSearch({ onAdd }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setStatus('loading')
      try {
        setResults(await searchPaints(query, { signal: controller.signal }))
        setStatus('idle')
      } catch (err) {
        if (err.name !== 'AbortError') setStatus('error')
      }
    }, 300) // debounce: wait 300 ms after the last keystroke

    // Cleanup runs before the next effect and when the component disappears
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return (
    <section>
      <label htmlFor="paint-search">Search paints</label>
      <input
        id="paint-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Abaddon Black"
      />

      {status === 'loading' && <p>Searching…</p>}
      {status === 'error' && <p className="error">Could not search. Are you online?</p>}

      <ul>
        {results.map((paint) => (
          <li key={paint.sourceId}>
            <span className="swatch" style={{ backgroundColor: paint.hex }} />
            {paint.name} <small>{paint.brand} · {paint.range}</small>
            <button onClick={() => onAdd(paint)}>Add</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PaintSearch
```

New ideas in this component:

- **The cleanup function** that `useEffect` returns. It works like `removeEventListener`: it undoes what the effect set up. Read more in [React basics → Effects](02-react-basics.md#effects-talking-to-the-outside-world).
- **Three UI states** (idle, loading, error). Always handle all three. The [PWA](10-pwa.md) will often be used in a shop with poor signal.

## Adding by paint code

Some brands (Vallejo, for example) print a code on every bottle. Build a small form with a brand `<select>` (only listing brands the data source supports) and a code input, then call `findPaintByCode`. Show "Not found" if it returns `null`. Tidy the input first, for example remove spaces and make it upper case.

## Adding to the inventory

The add action belongs with the shared data ([Architecture → context](03-architecture.md#sharing-state-with-context)). Use it to stop duplicates being added: if the paint is already owned, increase the quantity.

```js
function addPaint(paint) {
  setPaints((prev) => {
    const existing = prev.find((p) => p.sourceId === paint.sourceId)
    if (existing) {
      return prev.map((p) => (p.id === existing.id ? { ...p, quantity: p.quantity + 1 } : p))
    }
    return [...prev, { ...paint, id: crypto.randomUUID(), quantity: 1 }]
  })
}
```

This is also where you record a `paint-added` [statistics event](09-statistics.md).

## Showing the inventory

- `PaintList` maps over `paints` and renders a `PaintCard` for each one ([props example](02-react-basics.md#props-passing-data-into-a-component)).
- Each card shows a colour swatch, name, brand, range and code, and has buttons for **+ / −** quantity, **Add to shopping list** ([Shopping list](08-shopping-list.md#adding-items)) and **Remove**.
- Useful extras: filter by brand, sort by name or brand, and a "search my paints" box. The search runs only on data you already have, so it doesn't need an effect: [calculate it during render](02-react-basics.md#effects-talking-to-the-outside-world).

## Search results that aren't owned yet

The search results should also have an **Add to shopping list** button, because a common use case is finding a paint you *don't* own and planning to buy it. The [shopping item snapshot](04-data-and-storage.md#shopping-list-item) is designed for this.

---

Next: [Hobby materials →](07-hobby-materials.md)
