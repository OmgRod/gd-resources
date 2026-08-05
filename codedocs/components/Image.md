# Image

Render an optimized image with optional caption and aspect control.

## When to use

- Use for optimized image rendering with caption support in MDX pages.

## Props

- `alt` - Alternative text for accessibility.
- `aspect` - The aspect ratio to preserve.
- `blurDataURL` - Blur placeholder image data URL.
- `caption` - Optional caption text.
- `className` - Additional CSS classes to apply.
- `enforceAspect` - Whether to preserve a fixed aspect ratio.
- `height` - Height value or layout height.
- `loading` - Image loading strategy, such as lazy or eager.
- `placeholder` - Placeholder behavior for inputs or image loading.
- `priority` - Whether the image should be prioritized for loading.
- `sizes` - Image sizes attribute value.
- `src` - Image source URL.
- `style` - Inline styles or styling object applied to the component.
- `width` - Width value or layout width.

## Example

```jsx
<Image src="/path/image.png" alt="Example" caption="Image caption" width={600} />
```

## Notes

If `caption` is provided, the component renders a semantic `<figure>` wrapper. Otherwise it renders a plain inline wrapper to avoid invalid nesting in MDX.
