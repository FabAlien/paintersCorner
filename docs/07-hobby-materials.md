# 7. Hobby materials

[← Paint inventory](06-paint-inventory.md) · [Guide index](README.md) · Next: [Shopping list →](08-shopping-list.md)

From the [README](../README.md#hobby-materials):

> This section is free-form: you decide what to keep track of.
> - **Custom items** – add any material you want, with the information you choose.
> - **Categories** – create your own categories to make items easier to sort and find.
> - **Quantity of 0** – items can have a quantity of 0, for example so they can sit on the shopping list.
> - **Shopping list support** – custom items can be added to the shopping list, with the information you entered.

There is no API here. Everything the user enters is saved locally. The data shapes are in [Data model → Material](04-data-and-storage.md#material) and [Category](04-data-and-storage.md#category).

## The material form

The tricky part is **free-form fields**: the user can add as many label/value pairs as they want. This is a good exercise in [updating arrays in state](02-react-basics.md#never-mutate-state-replace-it):

```jsx
// src/features/materials/MaterialForm.jsx
import { useState } from 'react'

const EMPTY = { name: '', categoryId: '', quantity: 1, notes: '', fields: [] }

function MaterialForm({ categories, onSave, initial = EMPTY }) {
  const [form, setForm] = useState(initial)

  function update(key, value) {
    setForm({ ...form, [key]: value })
  }

  function updateField(index, key, value) {
    update('fields', form.fields.map((f, i) => (i === index ? { ...f, [key]: value } : f)))
  }

  function addField() {
    update('fields', [...form.fields, { label: '', value: '' }])
  }

  function removeField(index) {
    update('fields', form.fields.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...form,
      categoryId: form.categoryId || null,
      quantity: Math.max(0, Number(form.quantity) || 0),
      fields: form.fields.filter((f) => f.label.trim()),
    })
    setForm(EMPTY)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
      </label>

      <label>
        Category
        <select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
          <option value="">Uncategorised</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Quantity
        <input type="number" min="0" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
      </label>

      <fieldset>
        <legend>Extra information</legend>
        {form.fields.map((field, i) => (
          // Index as key is OK here only because the rows have no state of their own;
          // if you see weird input behaviour, give each field an id instead
          <div key={i}>
            <input placeholder="Label" value={field.label} onChange={(e) => updateField(i, 'label', e.target.value)} />
            <input placeholder="Value" value={field.value} onChange={(e) => updateField(i, 'value', e.target.value)} />
            <button type="button" onClick={() => removeField(i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addField}>+ Add field</button>
      </fieldset>

      <label>
        Notes
        <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} />
      </label>

      <button type="submit">Save</button>
    </form>
  )
}

export default MaterialForm
```

Things to notice:

- `type="button"` on the extra buttons. Inside a `<form>`, a button without a type submits the form, just as in plain HTML.
- `[key]: value` is a JavaScript *computed property name*. It lets one `update` function handle every input.
- In a real form, inputs return **strings**, so convert the quantity with `Number(...)`.
- You can reuse the same form for **editing** by passing an existing material as `initial`. If you do, give the form `key={material.id}` where you use it. This makes React start the form fresh when you switch to editing a different material.

In the shared actions, `addMaterial` adds `id: crypto.randomUUID()`, and `updateMaterial` replaces the material with the matching id.

## Categories

`CategoryManager` lets the user add, rename and delete categories. Decide what happens to items when their category is deleted. The simplest approach is to set their `categoryId` back to `null` (Uncategorised):

```js
function deleteCategory(id) {
  setCategories((prev) => prev.filter((c) => c.id !== id))
  setMaterials((prev) => prev.map((m) => (m.categoryId === id ? { ...m, categoryId: null } : m)))
}
```

## Showing materials grouped by category

Group the materials during render, so you don't need any extra state:

```jsx
const groups = [
  ...categories.map((c) => ({ ...c, items: materials.filter((m) => m.categoryId === c.id) })),
  { id: 'none', name: 'Uncategorised', items: materials.filter((m) => !m.categoryId) },
].filter((group) => group.items.length > 0)
```

Then render one `<section>` with a heading for each group. A category filter (`<select>` or chips) and a text search would make the list easier to use.

## Quantity of 0

Treat 0 as a normal, valid quantity:

- The − button stops at 0 and doesn't delete the item: `Math.max(0, quantity - 1)`.
- Show items with a quantity of 0 differently, for example faded with an "Out of stock" label, so the user notices them.
- A good shortcut is an **Add to shopping list** button that is easy to find on items with a quantity of 0. You could also offer to add an item to the list automatically when its quantity reaches 0.

Use a shared `QuantityControl` component in `src/components/` for both paints and materials.

## Adding a material to the shopping list

Build a [shopping item snapshot](04-data-and-storage.md#shopping-list-item) that contains what the user entered:

```js
addToShoppingList({
  kind: 'material',
  refId: material.id,
  name: material.name,
  details: material.fields.map((f) => `${f.label}: ${f.value}`).join(' · '),
  quantity: 1,
})
```

The rest of the shopping list is covered in the next guide.

---

Next: [Shopping list →](08-shopping-list.md)
