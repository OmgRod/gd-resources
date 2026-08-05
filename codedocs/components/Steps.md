# Steps

Render a numbered step list with optional child step items.

## Usage

Use `items` or `<Step>` children to render a numbered list of steps.

## When to use

- Use to show step-by-step instructions or procedures.

## Props

- `children` - Nested content or child elements.

## Example

```jsx
<Steps items={["Install the mod", "Restart the game", "Verify the mod loader"]} />
```

## Notes

Supports either an `items` array or nested `<Step>` children.
