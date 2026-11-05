# 3. Architecture

[← React for web developers](02-react-basics.md) · [Guide index](README.md) · Next: [Data model and storage →](04-data-and-storage.md)

This guide proposes a structure for the app. It is a starting point, not a rule. If you change it, update this page.

## Suggested folder structure

```
src/
├── main.jsx                 Entry point (leave as is)
├── App.jsx                  Layout + tab switching + shared state
├── index.css                Global styles, CSS variables
│
├── components/              Small reusable building blocks
│   ├── Tabs.jsx
│   ├── Modal.jsx
│   ├── QuantityControl.jsx
│   └── ColorSwatch.jsx
│
├── features/                One folder per tab in the README
│   ├── inventory/
│   │   ├── InventoryTab.jsx
│   │   ├── PaintSearch.jsx
│   │   ├── PaintCodeInput.jsx
│   │   ├── PaintList.jsx
│   │   └── PaintCard.jsx
│   ├── materials/
│   │   ├── MaterialsTab.jsx
│   │   ├── MaterialForm.jsx
│   │   ├── MaterialList.jsx
│   │   └── CategoryManager.jsx
│   ├── shopping/
│   │   ├── ShoppingTab.jsx
│   │   ├── ShoppingItem.jsx
│   │   ├── ShoppingOverview.jsx
│   │   └── ConfirmPurchase.jsx
│   └── stats/
│       └── StatsTab.jsx
│
├── hooks/
│   └── useLocalStorage.js   Saves state between visits
│
├── services/
│   └── paintApi.js          All code that talks to the paint API
│
└── state/
    └── AppDataContext.jsx   Shared data + actions (optional, see below)
```

Why use this layout:

- **`features/`** matches the tabs listed in the [README](../README.md#functions), so you can easily find the code for each feature.
- **`components/`** holds pieces that don't know anything about paints or materials. You could reuse them in another app.
- **`services/`** keeps `fetch` code out of components, so you can switch to a different paint API by changing only one file. See [Paint inventory](06-paint-inventory.md#keep-the-api-in-one-file).

## Component tree

```
<App>
├── <header>  (app title)
├── <Tabs>    (Inventory | Materials | Shopping list | Statistics)
└── <main>    one of:
    ├── <InventoryTab>
    │   ├── <PaintSearch>     search the API, add result
    │   ├── <PaintCodeInput>  add by code (supported brands)
    │   └── <PaintList> → <PaintCard>*
    ├── <MaterialsTab>
    │   ├── <CategoryManager>
    │   ├── <MaterialForm>
    │   └── <MaterialList> → <MaterialCard>*
    ├── <ShoppingTab>
    │   ├── <ShoppingOverview>  "3 of 7 bought"
    │   ├── <ShoppingItem>*     checkbox per item
    │   └── <ConfirmPurchase>   confirmation screen
    └── <StatsTab>
```

## Where state lives

The rule from [lifting state up](02-react-basics.md#lifting-state-up) is to put each piece of state in the closest component that all of its users share.

| State                                   | Used by                               | Lives in        |
| --------------------------------------- | ------------------------------------- | --------------- |
| Active tab                              | `Tabs`, `<main>`                      | `App`           |
| Owned paints                            | Inventory, Shopping, Stats            | `App` / context |
| Materials + categories                  | Materials, Shopping, Stats            | `App` / context |
| Shopping list                           | Inventory, Materials, Shopping, Stats | `App` / context |
| Statistics / history                    | Shopping (writes), Stats (reads)      | `App` / context |
| Search text, search results, loading    | Only `PaintSearch`                    | `PaintSearch`   |
| Form field values                       | Only the form                         | The form        |

Only data that belongs to the whole app goes at the top. Temporary UI state, like what is typed in a search box, stays in the component that uses it.

All shared data is saved to `localStorage` so it survives a page reload. The details are in [Data model and storage](04-data-and-storage.md).

## Sharing state with context

Four tabs need the same data, and the shopping list is changed from three different places, so passing props everywhere quickly becomes messy. A good solution is one context that holds the data **and** the functions that change it:

```jsx
// src/state/AppDataContext.jsx
import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [paints, setPaints] = useLocalStorage('pc.paints', [])
  const [shoppingList, setShoppingList] = useLocalStorage('pc.shopping', [])
  // ...materials, categories, stats

  function addPaint(paint) {
    setPaints((prev) => [...prev, paint])
  }

  function addToShoppingList(item) {
    setShoppingList((prev) => [...prev, item])
  }

  const value = { paints, shoppingList, addPaint, addToShoppingList }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppData() {
  return useContext(AppDataContext)
}
```

Wrap the app with it in `main.jsx`:

```jsx
<StrictMode>
  <AppDataProvider>
    <App />
  </AppDataProvider>
</StrictMode>
```

Any component can then read the data or change it:

```jsx
const { paints, addToShoppingList } = useAppData()
```

All changes go through named functions like `addPaint` and `markBought`, so the rules (for example "quantity can't go below 0", or "record a stat when something is bought") are in **one place** and not spread across many components.

If the provider file grows too big, you can split it into one context per feature, or look at `useReducer` ([react.dev/reference/react/useReducer](https://react.dev/reference/react/useReducer)).

---

Next: [Data model and storage →](04-data-and-storage.md)
