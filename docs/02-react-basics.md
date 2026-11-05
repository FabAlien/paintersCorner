# 2. React for web developers

[← Project setup](01-project-setup.md) · [Guide index](README.md) · Next: [Architecture →](03-architecture.md)

This guide covers only the parts of React you need for this project, and compares each one to how you would do it in plain JavaScript. For more depth, see [react.dev/learn](https://react.dev/learn).

## The big idea: describe, don't manipulate

With plain DOM code you change the page step by step:

```js
const li = document.createElement('li')
li.textContent = paint.name
list.appendChild(li)
counter.textContent = list.children.length
```

In React you **describe what the page should look like for the current data**, and React works out which DOM changes are needed:

```jsx
<p>{paints.length} paints</p>
<ul>
  {paints.map((paint) => (
    <li key={paint.id}>{paint.name}</li>
  ))}
</ul>
```

When `paints` changes, React re-runs this code and updates the DOM to match. You never call `appendChild`, `querySelector` or `textContent` yourself. If you catch yourself reaching for `document.querySelector`, there is almost always a React way to do it instead.

## JSX: HTML inside JavaScript

JSX looks like HTML, but there are a few differences:

| HTML                          | JSX                                    | Why                                       |
| ----------------------------- | -------------------------------------- | ----------------------------------------- |
| `class="card"`                | `className="card"`                     | `class` is a reserved word in JS          |
| `for="name"`                  | `htmlFor="name"`                       | `for` is a reserved word in JS            |
| `onclick="save()"`            | `onClick={save}`                       | Events are camelCase and take a function  |
| `style="color: red"`          | `style={{ color: 'red' }}`             | Style is a JS object                      |
| `<input>`                     | `<input />`                            | Every tag must be closed                  |
| `<!-- comment -->`            | `{/* comment */}`                      |                                           |

- **Curly braces `{}`** insert any JavaScript *expression*: `{paint.name}`, `{count * 2}`, `{isOpen ? 'Close' : 'Open'}`. Statements like `if` and `for` don't work inside braces. Use the alternatives shown below.
- A component must return **one root element**. If you don't want an extra `<div>`, wrap the elements in an empty *fragment*: `<>...</>`.

## Components

A component is a function that returns JSX. Its name **must start with a capital letter**.

```jsx
function PaintCard() {
  return (
    <article className="paint-card">
      <h3>Abaddon Black</h3>
    </article>
  )
}

export default PaintCard
```

You use it like an HTML tag: `<PaintCard />`. Think of components as custom elements that you build yourself. Put one component in each file, named after the component (`PaintCard.jsx`).

## Props: passing data into a component

Props work like HTML attributes, but they can hold any value: strings, numbers, objects, arrays or functions.

```jsx
// Using it
<PaintCard paint={paint} onRemove={removePaint} />

// Defining it: props arrive as one object, usually destructured
function PaintCard({ paint, onRemove }) {
  return (
    <article className="paint-card">
      <span className="swatch" style={{ backgroundColor: paint.hex }} />
      <h3>{paint.name}</h3>
      <p>{paint.brand} · {paint.range}</p>
      <button onClick={() => onRemove(paint.id)}>Remove</button>
    </article>
  )
}
```

Props are **read-only**. A component never changes its own props. If a child needs to change something, the parent passes it a function (like `onRemove` above) and the child calls that function.

`children` is a special prop that holds whatever you put between the opening and closing tags:

```jsx
<Modal>
  <p>Are you sure?</p>
</Modal>

function Modal({ children }) {
  return <div className="modal">{children}</div>
}
```

## State: data that changes

A normal variable is reset every time the component runs, and changing it doesn't update the screen. For values that change over time, use **state**:

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0) // 0 is the starting value

  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
}
```

`useState` returns the current value and a function that changes it. Calling `setCount` tells React "this changed, render again".

### Never mutate state: replace it

This is the most common beginner bug. React only re-renders when it gets a **new** object or array. If you change the existing one, React doesn't notice:

```jsx
// ❌ Wrong: mutates the existing array, so React may not re-render
paints.push(newPaint)
setPaints(paints)

// ✅ Right: create a new array
setPaints([...paints, newPaint])
```

These are the patterns you'll use all the time:

```jsx
// Add
setItems([...items, newItem])

// Remove
setItems(items.filter((item) => item.id !== id))

// Update one item
setItems(items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))

// Update one field of an object
setForm({ ...form, name: 'New name' })
```

If the new value depends on the old value, pass a function. It always gets the latest value:

```jsx
setCount((prev) => prev + 1)
```

## Events

```jsx
<button onClick={handleClick}>Save</button>         // pass the function itself
<button onClick={() => remove(paint.id)}>X</button>  // wrap it if you need arguments
<button onClick={handleClick()}>Save</button>        // ❌ calls it immediately on every render
```

The event object works like the one you know from `addEventListener`: `event.target`, `event.preventDefault()` and so on.

## Forms and controlled inputs

In React the input's value usually lives in state, and the input shows that state. This is called a *controlled input*:

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('')

  function handleSubmit(event) {
    event.preventDefault() // stop the page from reloading, like in plain JS
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">Search paints</label>
      <input id="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  )
}
```

For checkboxes, use `checked` and `e.target.checked` instead of `value`. You'll need this for the [shopping list](08-shopping-list.md).

## Conditional rendering

```jsx
{isLoading && <p>Loading…</p>}                       // show or hide
{items.length === 0 ? <p>Empty</p> : <List items={items} />}  // either/or
```

For more complex cases, use a normal `if` before the `return`:

```jsx
if (error) return <p className="error">{error}</p>
return <PaintList paints={paints} />
```

Watch out: `{items.length && <List />}` shows a literal `0` when the list is empty. Write `{items.length > 0 && <List />}` instead.

## Lists and keys

Use `.map()` to turn an array into elements. Each element needs a **`key`** that is unique among its siblings and doesn't change between renders:

```jsx
<ul>
  {paints.map((paint) => (
    <li key={paint.id}>{paint.name}</li>
  ))}
</ul>
```

Use a real id as the key, not the array index. Index keys cause bugs when items are reordered or removed, for example checkboxes that end up ticked on the wrong row. [Data model](04-data-and-storage.md#ids) shows how to create ids.

## Lifting state up

When two components need the same data, move the state to their **closest common parent** and pass it down as props. For example, both the inventory and the shopping list need to know which paints exist, so that state lives above both of them. [Architecture](03-architecture.md) shows where each piece of state lives in this app.

## Effects: talking to the outside world

Rendering should only calculate JSX. Anything that reaches outside React, like fetching from an API, using `localStorage` or setting timers, goes in `useEffect`:

```jsx
import { useEffect, useState } from 'react'

function PaintSearch({ query }) {
  const [results, setResults] = useState([])

  useEffect(() => {
    // runs after render, and again whenever `query` changes
    fetch(`/api/paints?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then(setResults)
  }, [query]) // dependency array: re-run when these values change

  return <ResultList results={results} />
}
```

- `[]` means "run once when the component first appears".
- `[a, b]` means "run when `a` or `b` changes".
- With no array at all, the effect runs after every render, which you rarely want.

Don't use effects for things you can simply calculate. If you can work a value out from state, calculate it during render:

```jsx
// ✅ No effect or extra state needed
const boughtCount = items.filter((item) => item.bought).length
```

[Paint inventory](06-paint-inventory.md) and [Data and storage](04-data-and-storage.md) use effects for real work.

## Rules of hooks

Functions that start with `use` (`useState`, `useEffect`, your own `useLocalStorage`, and so on) are called **hooks**. They follow two rules, and ESLint enforces them:

1. Only call hooks at the **top level** of a component or of another hook. Never call them inside `if`, loops or callbacks.
2. Only call them from **React components or custom hooks**, not from ordinary functions.

React tells hooks apart by the order they are called in, so that order must be the same on every render.

## Custom hooks

If several components need the same stateful logic, move it into a function whose name starts with `use`:

```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = () => setOn((prev) => !prev)
  return [on, toggle]
}
```

You'll write a `useLocalStorage` hook in [Data and storage](04-data-and-storage.md#saving-with-uselocalstorage).

## Context: avoiding "prop drilling"

When data has to pass through many layers of components that don't use it, **context** lets deeper components read it directly. [Architecture](03-architecture.md#sharing-state-with-context) shows how this app can use it. Begin with plain props, and switch to context only when passing props becomes painful.

## Debugging tips

- Install the **React Developer Tools** browser extension. It lets you inspect components and see their props and state live.
- `console.log` inside a component runs on **every render**. That is useful for seeing *when* a component renders.
- A blank page usually means a JavaScript error. Check the browser console and the terminal running `npm run dev`.

---

Next: [Architecture →](03-architecture.md)
