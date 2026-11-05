# 5. Tab navigation

[← Data model and storage](04-data-and-storage.md) · [Guide index](README.md) · Next: [Paint inventory →](06-paint-inventory.md)

The [README](../README.md#functions) describes three main tabs plus a statistics tab. This is the first real feature to build, because every other feature lives inside a tab.

## Option A: tabs with state (recommended to start)

You don't need a router for four tabs. One piece of state in `App` decides which tab is shown:

```jsx
// src/App.jsx
import { useState } from 'react'
import Tabs from './components/Tabs'
import InventoryTab from './features/inventory/InventoryTab'
import MaterialsTab from './features/materials/MaterialsTab'
import ShoppingTab from './features/shopping/ShoppingTab'
import StatsTab from './features/stats/StatsTab'

const TABS = [
  { id: 'inventory', label: 'Paints', Component: InventoryTab },
  { id: 'materials', label: 'Materials', Component: MaterialsTab },
  { id: 'shopping', label: 'Shopping list', Component: ShoppingTab },
  { id: 'stats', label: 'Statistics', Component: StatsTab },
]

function App() {
  const [activeTab, setActiveTab] = useState('inventory')
  const { Component } = TABS.find((tab) => tab.id === activeTab)

  return (
    <>
      <header>
        <h1>Painter&apos;s Corner</h1>
      </header>
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      <main>
        <Component />
      </main>
    </>
  )
}

export default App
```

```jsx
// src/components/Tabs.jsx
function Tabs({ tabs, activeTab, onChange }) {
  return (
    <nav className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={tab.id === activeTab}
          className={tab.id === activeTab ? 'tab tab--active' : 'tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default Tabs
```

Notes:

- In JSX, `'` inside text has to be written as `&apos;`, otherwise ESLint complains.
- Only the active tab is rendered. When you switch away, a tab's **local** state, such as half-typed form input, is lost. Shared data isn't lost, because it lives in [context](03-architecture.md#sharing-state-with-context) or `App`.
- To make the tabs feel like an app on phones, you can style the `<nav>` as a bottom bar. See [Styling](11-styling.md#mobile-first).

### Remembering the last tab

If you want the app to open on the tab the user was on last time, replace `useState` with the [`useLocalStorage`](04-data-and-storage.md#saving-with-uselocalstorage) hook:

```jsx
const [activeTab, setActiveTab] = useLocalStorage('pc.activeTab', 'inventory')
```

### Showing a badge on the shopping tab

Add a `badge` value to each tab and show it in `Tabs`. For example, show the number of items not yet bought:

```jsx
const remaining = shoppingList.filter((item) => !item.bought).length
```

## Option B: a router (later, if needed)

If you want each tab to have its own URL (`/paints`, `/shopping`), so the browser back button works and links can be bookmarked, add [React Router](https://reactrouter.com/). This is more setup, and a PWA also needs a fallback so that refreshing `/shopping` still loads the app. Begin with Option A. You can switch later without changing the tab components themselves.

---

Next: [Paint inventory →](06-paint-inventory.md)
