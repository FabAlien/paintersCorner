# 1. Project setup and tooling

[← Back to guide index](README.md) · Next: [React for web developers →](02-react-basics.md)

## Running the project

You need [Node.js](https://nodejs.org/) (the LTS version is fine). In a terminal at the project root:

```bash
npm install   # first time only, and whenever package.json changes
npm run dev   # start the development server
```

Open the URL Vite prints, usually `http://localhost:5173`. Leave the server running while you work: when you save a file the page updates by itself, and usually your React state survives the update (this is called *hot module replacement*).

## What is Vite?

In a plain HTML/JS project the browser loads your files directly. React code is written in **JSX** (HTML-like syntax inside JavaScript), which browsers can't run, so something has to translate it first. **Vite** does that translation. It also:

- serves the app while you develop (`npm run dev`),
- lets you `import` CSS, images and npm packages from JavaScript,
- bundles and minifies everything into a `dist/` folder for publishing (`npm run build`).

## Files in the repository

```
paintersCorner/
├── index.html          The only HTML page. React renders into <div id="root">
├── public/             Copied to the build as-is (favicon, later PWA icons)
├── src/
│   ├── main.jsx        Entry point: starts React and renders <App />
│   ├── App.jsx         The top-level component. Start here
│   └── index.css       Global styles
├── vite.config.js      Vite configuration (plugins go here)
├── eslint.config.js    Lint rules for JavaScript/React
├── .prettierrc         Formatting rules: no semicolons, single quotes
├── .stylelintrc.json   Lint rules for CSS
└── docs/               This guide
```

### How the page starts

1. The browser loads [`index.html`](../index.html), which contains an empty `<div id="root"></div>` and `<script type="module" src="/src/main.jsx">`.
2. [`src/main.jsx`](../src/main.jsx) finds that div and tells React to render the `<App />` component inside it.
3. [`src/App.jsx`](../src/App.jsx) returns the markup for the whole app.

You will almost never need to edit `index.html` or `main.jsx` again. The exceptions are the page `<title>` and the PWA meta tags (see [Making it a PWA](10-pwa.md)).

`<StrictMode>` in `main.jsx` is a development-only helper. It deliberately runs some of your code twice to expose bugs. If you see a `console.log` print twice in development, this is why, and it does not happen in the built app.

## npm scripts

| Command            | What it does                                                         |
| ------------------ | -------------------------------------------------------------------- |
| `npm run dev`      | Starts the development server with live reload                       |
| `npm run build`    | Builds the production version into `dist/`                           |
| `npm run preview`  | Serves the `dist/` build locally so you can test it                  |
| `npm run lint`     | Checks `src/` with ESLint, which catches bugs and React mistakes     |
| `npm run lint:css` | Checks CSS files with Stylelint                                      |
| `npm run format`   | Formats `src/` with Prettier                                         |

Before committing, run `npm run format`, `npm run lint` and `npm run lint:css`, and fix what they report.

## Recommended VS Code extensions

[`.vscode/extensions.json`](../.vscode/extensions.json) lists recommended extensions, and VS Code offers to install them when you open the folder. The most important ones are:

- **ESLint** and **Stylelint**, which underline problems as you type.
- **Prettier**, which formats on save. Turn on *Editor: Format On Save* in your settings.
- **ES7+ React snippets**: type `rafce` and press Tab to get a new component skeleton.
- **Error Lens**, which shows errors inline next to the code.

## The ESLint rules worth knowing

[`eslint.config.js`](../eslint.config.js) turns on two React-specific checks you will run into:

- **`react-hooks/rules-of-hooks`** (error): hooks like `useState` must be called at the top level of a component, never inside `if`, loops or nested functions. [React for web developers](02-react-basics.md#rules-of-hooks) explains why.
- **`react-hooks/exhaustive-deps`** (warning): you forgot something in a `useEffect` dependency array. Read the warning, because it is almost always right.

`react/prop-types` is turned off, so you don't need to declare prop types.

---

Next: [React for web developers →](02-react-basics.md)
