# Developer guide

These notes explain how to keep building **Painter's Corner**, the app described in the [project README](../README.md).

They assume you already know **HTML, CSS and JavaScript** well but are **new to React**. Wherever it helps, the guide compares "the React way" to how you would do the same thing with plain DOM code.

## Where the project is now

The repository holds only the starting scaffold: Vite, React, ESLint, Prettier and Stylelint are set up, and [`src/App.jsx`](../src/App.jsx) renders one heading. Everything else described in the README still has to be built.

## Reading order

Read the first three guides in order. After that, use the rest as a reference while you build each feature.

| #   | Guide                                                    | What it covers                                                              |
| --- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | [Project setup and tooling](01-project-setup.md)          | Running the app, the files in the repo, npm scripts, lint and format        |
| 2   | [React for web developers](02-react-basics.md)            | JSX, components, props, state, events, lists, effects                       |
| 3   | [Architecture](03-architecture.md)                        | Folder structure, component tree, where data lives                          |
| 4   | [Data model and storage](04-data-and-storage.md)          | The shape of paints, materials and list items; saving to `localStorage`     |
| 5   | [Tab navigation](05-navigation.md)                        | Switching between Inventory, Materials, Shopping list and Statistics        |
| 6   | [Paint inventory](06-paint-inventory.md)                  | Fetching paint data from an API, search, adding by paint code               |
| 7   | [Hobby materials](07-hobby-materials.md)                  | Free-form items, custom categories, quantity 0                              |
| 8   | [Shopping list](08-shopping-list.md)                      | Checkboxes, the overview counter, the confirmation screen                   |
| 9   | [Statistics](09-statistics.md)                            | Recording lifetime usage and showing it                                     |
| 10  | [Making it a PWA](10-pwa.md)                              | Manifest, service worker, offline use, installing on a phone                |
| 11  | [Styling](11-styling.md)                                  | How to organise CSS in a React project                                      |
| 12  | [Roadmap](12-roadmap.md)                                  | Suggested build order, written as a checklist                               |

## Conventions used in these guides

- Code examples follow the project's Prettier settings: **no semicolons** and **single quotes**. Run `npm run format` and Prettier fixes this for you.
- File paths are relative to the project root, for example `src/components/Tabs.jsx`.
- Folder and file names under `src/` are **suggestions**. Change them if you find a structure you like better, but update [Architecture](03-architecture.md) when you do so the next person isn't confused.

## Official resources

- [react.dev/learn](https://react.dev/learn) is the official React tutorial and the best place to go deeper than these notes.
- [vite.dev/guide](https://vite.dev/guide/) is the Vite documentation.
- [MDN](https://developer.mozilla.org/) is still your reference for HTML, CSS and browser APIs. React does not replace any of that.
