# 11. Styling

[← Making it a PWA](10-pwa.md) · [Guide index](README.md) · Next: [Roadmap →](12-roadmap.md)

The good news is that **React doesn't change CSS**. Everything you know still works. The only real changes are that you write `className` instead of `class`, and that you load CSS by importing it.

## How CSS is loaded

In [`src/main.jsx`](../src/main.jsx):

```js
import './index.css'
```

Vite adds the CSS to the page. Any component can import its own CSS file the same way:

```jsx
// src/features/shopping/ShoppingItem.jsx
import './ShoppingItem.css'
```

**Be careful:** imported CSS is still **global**. A `.card` rule in `PaintCard.css` also affects every other `.card` in the app. Choose one of these approaches and use it everywhere.

### Option 1: plain CSS with BEM-style class names (simplest)

Prefix classes with the component name: `.paint-card`, `.paint-card__swatch`, `.paint-card--empty`. Put one CSS file next to each component. There is nothing new to learn.

### Option 2: CSS Modules (automatic scoping)

Name the file `PaintCard.module.css`. Vite then makes every class name unique for you:

```css
/* PaintCard.module.css */
.card {
  display: flex;
  gap: var(--space-2);
}
```

```jsx
import styles from './PaintCard.module.css'

<article className={styles.card}>...</article>
```

There's no setup, because Vite supports this out of the box. It's useful if the project grows, or if several people work on it.

## Global styles and design tokens

Use [`src/index.css`](../src/index.css) for resets, base typography and **CSS custom properties**, so all components use the same colours and spacing:

```css
:root {
  --color-bg: #1e1e2e;
  --color-surface: #2a2a3c;
  --color-text: #f1f1f5;
  --color-accent: #e0a458;
  --color-danger: #e05858;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius: 0.5rem;

  color-scheme: dark;
  font-family: system-ui, sans-serif;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
}
```

Use the same colour for `theme_color` in the [PWA manifest](10-pwa.md#setup).

## Mobile first

People will mostly use this on a phone in a shop, so:

- Write styles for small screens first, and add `@media (min-width: …)` for larger ones.
- Make tap targets **at least 44 × 44 px**. This matters especially for the [shopping list checkboxes](08-shopping-list.md#checkboxes).
- Think about a **bottom tab bar** on phones ([Tab navigation](05-navigation.md)):

```css
.tabs {
  position: fixed;
  inset: auto 0 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-bottom: env(safe-area-inset-bottom); /* iPhone home bar */
  background: var(--color-surface);
}

main {
  padding-bottom: 5rem; /* so content isn't hidden behind the bar */
}
```

## Dynamic styles

For values that come from data, like a paint's colour, use the `style` prop. For on/off states, switch class names:

```jsx
<span className="swatch" style={{ backgroundColor: paint.hex }} />
<li className={item.bought ? 'shopping-item shopping-item--bought' : 'shopping-item'}>
```

## Linting

`npm run lint:css` runs Stylelint with [`stylelint-config-standard`](../.stylelintrc.json). It enforces things like lowercase hex colours and kebab-case class names. The kebab-case rule fits Option 1 above. If you choose CSS Modules with camelCase class names, you may need to change the `selector-class-pattern` rule.

---

Next: [Roadmap →](12-roadmap.md)
