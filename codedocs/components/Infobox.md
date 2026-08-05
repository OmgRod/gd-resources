# Infobox

Render an informational box with optional image and item list.

## When to use

- Use to display summary content alongside an optional image.

## Props

- `image` - Image source URL or image data.
- `imageAlt` - Alternative text for the info box image.
- `imageCaption` - Caption text for the info box image.
- `items` - Array of items or content entries.
- `title` - Title or heading text.

## Example

```jsx
<Infobox title="Info title" image="/image.png" imageAlt="Alt text" items={["First", "Second"]} />
```
