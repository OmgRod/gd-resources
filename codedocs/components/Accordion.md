# Accordion

Render an expandable accordion list from either an `items` array or nested `<Accordion.Item>` children.

## Props

- `items` - An array of accordion entries with `id`, `title`, and `children` or `content`.
- `children` - Nested `<Accordion.Item>` components for MDX-style accordion content.

## Notes

- The first item is opened by default.
- If `children` are provided, each child should include an `id` and `title` prop.
- `<Accordion.Item>` is a marker component rendered by `Accordion`.

## Example

```jsx
<Accordion
  items={[
    { id: 'one', title: 'First item', children: 'First item content.' },
    { id: 'two', title: 'Second item', children: 'Second item content.' },
  ]}
/>
```
