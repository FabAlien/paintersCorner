# 12. Roadmap

[← Styling](11-styling.md) · [Guide index](README.md)

This is a suggested order of work. Each step builds on the one before it, so the app can be used early and keeps getting better. Tick boxes off as you go (`[x]`) and commit this file, so the next person can see where things stand.

## Phase 1: foundations

- [x] Scaffold Vite + React + lint/format tooling ([Project setup](01-project-setup.md))
- [ ] Work through the core ideas in [React for web developers](02-react-basics.md)
- [ ] Create the folder structure from [Architecture](03-architecture.md)
- [ ] Global styles and CSS variables in `index.css` ([Styling](11-styling.md#global-styles-and-design-tokens))
- [ ] Tab navigation with four empty tabs ([Tab navigation](05-navigation.md))
- [ ] `useLocalStorage` hook ([Data and storage](04-data-and-storage.md#saving-with-uselocalstorage))
- [ ] `AppDataProvider` context with empty arrays ([Architecture](03-architecture.md#sharing-state-with-context))
- [ ] `logEvents` action, so history is recorded from day one ([Statistics](09-statistics.md#record-first-show-later))

## Phase 2: hobby materials

This comes before paints because it doesn't depend on an API, so it's a good first full feature.

- [ ] Add / edit / delete materials with free-form fields ([Hobby materials](07-hobby-materials.md#the-material-form))
- [ ] Categories: add, rename, delete ([Categories](07-hobby-materials.md#categories))
- [ ] Group the list by category, plus search and filter
- [ ] Quantity controls that allow 0 ([Quantity of 0](07-hobby-materials.md#quantity-of-0))

## Phase 3: shopping list

- [ ] `addToShoppingList` with duplicate merging ([Adding items](08-shopping-list.md#adding-items))
- [ ] "Add to shopping list" button on materials
- [ ] Checkboxes and remove ([Checkboxes](08-shopping-list.md#checkboxes))
- [ ] Overview "X of Y bought" ([Overview](08-shopping-list.md#overview))
- [ ] Confirmation screen, and `completeShopping` updating quantities ([Confirmation](08-shopping-list.md#confirmation-screen))
- [ ] Item count badge on the tab

## Phase 4: paint inventory

- [ ] **Choose a paint data source** and write the choice down ([Step 0](06-paint-inventory.md#step-0-choose-a-data-source))
- [ ] `src/services/paintApi.js` with `searchPaints` and `findPaintByCode` ([Keep the API in one file](06-paint-inventory.md#keep-the-api-in-one-file))
- [ ] Search with debounce, loading and error states ([Search component](06-paint-inventory.md#search-component))
- [ ] Add by paint code for supported brands
- [ ] Paint list with swatches, quantity, remove
- [ ] "Add to shopping list" from owned paints **and** search results

## Phase 5: statistics

- [ ] Agree on which statistics to show, and update the [README](../README.md)
- [ ] Stats tab calculated from the event log ([Statistics](09-statistics.md#ideas-for-what-to-show))

## Phase 6: PWA and release

- [ ] Icons and manifest via `vite-plugin-pwa` ([PWA setup](10-pwa.md#setup))
- [ ] Test offline in `npm run preview` ([Testing](10-pwa.md#testing))
- [ ] Deploy to an HTTPS host and install it on a phone ([Testing on your phone](10-pwa.md#testing-on-your-phone))
- [ ] Mobile layout pass: bottom tab bar, tap target sizes ([Mobile first](11-styling.md#mobile-first))

## Nice to have (outside the current README)

- Export / import data as a JSON file, as a backup or for moving to a new phone
- Photos of materials (would need IndexedDB, see [Limits](04-data-and-storage.md#limits))
- Sync between devices (would need a backend and user accounts)
- "Paints I want" wishlist, separate from the shopping list
- Light theme

## Before each commit

```bash
npm run format
npm run lint
npm run lint:css
```

Write commit messages that say *what* changed and *why*, for example `Add category manager to materials tab`.
