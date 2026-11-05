# Painter's Corner

A website and progressive web app (PWA) for miniature painters and hobbyists.

## Idea

Painter's Corner helps you keep track of what you have on your hobby desk and what you still need to buy:

- **Paint inventory** – keep track of your miniature paints.
- **Hobby materials** – keep track of brushes, primers, basing materials, tools and other supplies.
- **Shopping list** – make a list of what you are missing so you know what to buy next time you visit the hobby store.

Because it is a PWA, it can be installed on your phone and used like an app, for example to check your collection while you are in the store.

## Functions

The app has three main tabs, plus a statistics tab that shows lifetime usage.

### Paint inventory

Paint information is fetched from an API.

- **Adding paints** – find a paint with the search function, or, for some brands, just enter the paint code.
- **Paint details** – each paint has a manufacturer, paint range, code and colour.

### Hobby materials

This section is free-form: you decide what to keep track of.

- **Custom items** – add any material you want, with the information you choose.
- **Categories** – create your own categories to make items easier to sort and find.
- **Quantity of 0** – items can have a quantity of 0, for example so they can sit on the shopping list.
- **Shopping list support** – custom items can be added to the shopping list, with the information you entered.

### Shopping list

Any item from the paint inventory or hobby materials can be added to the shopping list.

- **Checkboxes** – tick off each item as you buy it.
- **Confirmation screen** – confirm when you have finished buying everything.
- **Overview** – see how many items are on the list and how many have been bought.

## Tech stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)

## Getting started

```bash
npm install
npm run dev
```

## Continuing development

See the [developer guide](docs/README.md) for how to build the rest of the app. It is written for people who know HTML, CSS and JavaScript but are new to React.
