# PeriodicTable

Render an interactive periodic table with highlighted elements.

## When to use

- Use to provide an interactive periodic table overview with highlights.

## Props

- `className` - Additional CSS classes to apply.
- `highlighted` - Values or symbols to highlight.
- `includeSymbols` - Symbol list to include in the periodic table.
- `showNames` - Whether to display element names.

## Example

```jsx
<PeriodicTable highlighted={["H", "He"]} showNames={true} />
```

## Notes

The periodic table animates on a canvas and supports element highlighting and subsets.
