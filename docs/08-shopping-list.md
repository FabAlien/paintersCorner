# 8. Shopping list

[← Hobby materials](07-hobby-materials.md) · [Guide index](README.md) · Next: [Statistics →](09-statistics.md)

From the [README](../README.md#shopping-list):

> Any item from the paint inventory or hobby materials can be added to the shopping list.
> - **Checkboxes** – tick off each item as you buy it.
> - **Confirmation screen** – confirm when you have finished buying everything.
> - **Overview** – see how many items are on the list and how many have been bought.

The item shape is described in [Data model → Shopping list item](04-data-and-storage.md#shopping-list-item).

## Adding items

The shopping list is changed from three places: owned paints, paint search results and materials. Put a single `addToShoppingList` action in the [shared context](03-architecture.md#sharing-state-with-context). If the same thing is already on the list, increase the quantity instead of adding a duplicate:

```js
function addToShoppingList(item) {
  setShoppingList((prev) => {
    const existing = item.refId && prev.find((s) => s.kind === item.kind && s.refId === item.refId)
    if (existing) {
      return prev.map((s) => (s.id === existing.id ? { ...s, quantity: s.quantity + item.quantity } : s))
    }
    return [...prev, { ...item, id: crypto.randomUUID(), bought: false }]
  })
}
```

Give the user feedback when an item is added (a short "Added to shopping list" message, or a badge on the tab: see [Tab navigation](05-navigation.md#showing-a-badge-on-the-shopping-tab)). Otherwise they'll press the button twice.

## Checkboxes

A [controlled checkbox](02-react-basics.md#forms-and-controlled-inputs) for each item:

```jsx
// src/features/shopping/ShoppingItem.jsx
function ShoppingItem({ item, onToggle, onRemove }) {
  return (
    <li className={item.bought ? 'shopping-item shopping-item--bought' : 'shopping-item'}>
      <label>
        <input type="checkbox" checked={item.bought} onChange={() => onToggle(item.id)} />
        {item.hex && <span className="swatch" style={{ backgroundColor: item.hex }} />}
        <span>
          {item.name} {item.quantity > 1 && <strong>×{item.quantity}</strong>}
          {item.details && <small>{item.details}</small>}
        </span>
      </label>
      <button onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
        ✕
      </button>
    </li>
  )
}

export default ShoppingItem
```

```js
function toggleBought(id) {
  setShoppingList((prev) => prev.map((s) => (s.id === id ? { ...s, bought: !s.bought } : s)))
}
```

Wrapping the checkbox and text in a `<label>` makes the whole row clickable. That matters on a phone in a shop.

Because `bought` is saved to `localStorage`, ticks survive if the phone locks or the app is closed halfway through shopping.

## Overview

You can calculate the overview from the list, so **don't** keep it in separate state:

```jsx
// src/features/shopping/ShoppingOverview.jsx
function ShoppingOverview({ items }) {
  const total = items.length
  const bought = items.filter((item) => item.bought).length

  return (
    <div className="overview">
      <p>
        {bought} of {total} bought
      </p>
      <progress value={bought} max={total || 1} />
    </div>
  )
}

export default ShoppingOverview
```

You could also sort unbought items to the top, or show them in two groups: "To buy" and "In the basket".

## Confirmation screen

When the user has finished shopping, they press **Finish shopping**. Show a confirmation that lists what was bought, and warn them about anything that wasn't ticked.

You can show this as a modal over the list, controlled by a piece of state in `ShoppingTab`:

```jsx
// inside ShoppingTab
const [confirming, setConfirming] = useState(false)

// ...
<button onClick={() => setConfirming(true)} disabled={!shoppingList.some((s) => s.bought)}>
  Finish shopping
</button>

{confirming && (
  <ConfirmPurchase
    items={shoppingList}
    onConfirm={() => {
      completeShopping()
      setConfirming(false)
    }}
    onCancel={() => setConfirming(false)}
  />
)}
```

The browser's built-in `<dialog>` element works well here and gives you focus handling and the Escape key for free. To use it from React, you need a [ref](https://react.dev/learn/manipulating-the-dom-with-refs). This is one of the few places where you touch the DOM directly:

```jsx
// src/components/Modal.jsx
import { useEffect, useRef } from 'react'

function Modal({ children, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.showModal()
  }, [])

  return (
    <dialog ref={ref} onClose={onClose} className="modal">
      {children}
    </dialog>
  )
}

export default Modal
```

## What "confirm" should do

This one action connects the whole app together, so write it carefully, in the shared context:

1. For every **bought** item:
   - **Paint**: increase the quantity in the inventory. If the paint isn't owned yet (`refId` is `null`), add it to the inventory using the stored `paint` object.
   - **Material**: increase that material's quantity by `item.quantity`.
   - Record a `purchased` [statistics event](09-statistics.md).
2. Remove the bought items from the list.
3. **Keep** the items that weren't bought, so they stay on the list for next time.

```js
function completeShopping() {
  const bought = shoppingList.filter((s) => s.bought)

  bought.forEach((item) => {
    if (item.kind === 'paint') {
      addPaintQuantity(item) // adds to existing paint, or creates it from item.paint
    } else {
      setMaterials((prev) =>
        prev.map((m) => (m.id === item.refId ? { ...m, quantity: m.quantity + item.quantity } : m)),
      )
    }
  })

  logEvents(
    bought.map((item) => ({
      type: 'purchased',
      kind: item.kind,
      name: item.name,
      quantity: item.quantity,
      date: new Date().toISOString(),
    })),
  )

  setShoppingList((prev) => prev.filter((s) => !s.bought))
}
```

Test the edge cases: an item whose material was deleted after it was added to the list (`refId` no longer matches anything), and a list where nothing is ticked.

---

Next: [Statistics →](09-statistics.md)
