# WikiTable

Render a styled table using the exported table helper components.

## Usage

Build tables with the exported `<Table>` helpers in MDX content.

## When to use

- Use to render structured table data with custom styling.

## Props

- `children` - Nested content or child elements.
- `className` - Additional CSS classes to apply.

## Example

```jsx
<Table>
  <THead>
    <TR>
      <TH>Header</TH>
    </TR>
  </THead>
  <TBody>
    <TR>
      <TD>Value</TD>
    </TR>
  </TBody>
</Table>
```

## Notes

Use the helper components `<THead>`, `<TBody>`, `<TR>`, `<TH>`, `<TD>`, and `<Caption>` to build tables.
