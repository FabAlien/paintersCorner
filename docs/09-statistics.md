# 9. Statistics

[← Shopping list](08-shopping-list.md) · [Guide index](README.md) · Next: [Making it a PWA →](10-pwa.md)

The [README](../README.md#functions) mentions "a statistics tab that shows lifetime usage" but doesn't define it in more detail. **Agree on exactly what to show before you build it**, then update the README.

## Record first, show later

"Lifetime" means data from the past, and the app can only show history it has saved. So begin **logging events early**, even before the statistics tab exists. Otherwise the first users will have no history.

Use the event log from [Data model → Statistics events](04-data-and-storage.md#statistics-events), stored under `pc.stats`. Add a `logEvents` action to the [shared context](03-architecture.md#sharing-state-with-context):

```js
const [stats, setStats] = useLocalStorage('pc.stats', [])

function logEvents(events) {
  setStats((prev) => [...prev, ...events])
}
```

Places to call it:

| Event              | Logged from                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `paint-added`      | `addPaint` ([Paint inventory](06-paint-inventory.md#adding-to-the-inventory)) |
| `material-added`   | `addMaterial` ([Hobby materials](07-hobby-materials.md))            |
| `purchased`        | `completeShopping` ([Shopping list](08-shopping-list.md#what-confirm-should-do)) |
| `used-up`          | When a quantity reaches 0 (optional)                                |

## Ideas for what to show

Everything here can be **calculated from the event log and current data** during render. You don't need extra state:

- Total paints owned, and the number of brands
- Total items bought, ever, and number of shopping trips
- Most-bought paint or material ("you've bought Nuln Oil 6 times")
- Paints per brand / range
- Purchases per month
- Materials that often run out

```jsx
// src/features/stats/StatsTab.jsx
import { useAppData } from '../../state/AppDataContext'

function StatsTab() {
  const { paints, stats } = useAppData()

  const purchases = stats.filter((e) => e.type === 'purchased')
  const totalBought = purchases.reduce((sum, e) => sum + e.quantity, 0)

  const timesBought = {}
  purchases.forEach((e) => {
    timesBought[e.name] = (timesBought[e.name] ?? 0) + e.quantity
  })
  const [topName, topCount] = Object.entries(timesBought).sort((a, b) => b[1] - a[1])[0] ?? []

  return (
    <section className="stats">
      <h2>Statistics</h2>
      <dl>
        <dt>Paints owned</dt>
        <dd>{paints.reduce((sum, p) => sum + p.quantity, 0)}</dd>
        <dt>Items bought (lifetime)</dt>
        <dd>{totalBought}</dd>
        {topName && (
          <>
            <dt>Most bought</dt>
            <dd>
              {topName} ({topCount}×)
            </dd>
          </>
        )}
      </dl>
    </section>
  )
}

export default StatsTab
```

If the calculations get slow with a very large history, wrap them in [`useMemo`](https://react.dev/reference/react/useMemo). With localStorage-sized data that is unlikely to be needed.

## Charts

For simple bar charts, you can make bars from plain `<div>`s with their width set to a percentage. You already know how to do that with CSS. If you want proper charts, a library like [Recharts](https://recharts.org/) works well with React. Install it with `npm install recharts`.

---

Next: [Making it a PWA →](10-pwa.md)
