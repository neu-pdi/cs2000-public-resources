# Domain Variable System

This system allows you to easily switch between different DCIC domain prefixes throughout the site.

## Configuration

The domain is configured in `docusaurus.config.ts`:

```typescript
customFields: {
  dcicDomain: 'https://dcic-world.org/2024-09-03/',
}
```

## Usage

### In Markdown Files

Use `{{DCIC_DOMAIN}}` in your markdown files:

```markdown
## Pre-reading: [3.1.1]({{DCIC_DOMAIN}}/getting-started.html) ...
```

This works in:
- `days/*.md` files
- `homework/*.md` files  
- `lab/*.md` files
- `recitation/*.md` files

### In React Components

Use the `useDcicDomain()` hook:

```tsx
import { useDcicDomain } from '../hooks/useDcicDomain';

function MyComponent() {
  const dcicDomain = useDcicDomain();
  
  return (
    <a href={`${dcicDomain}/some-path`}>
      Link to DCIC content
    </a>
  );
}
```

Or use the `DcicLink` component:

```tsx
import { DcicLink } from '../components/DcicLink';

function MyComponent() {
  return (
    <DcicLink path="/getting-started.html">
      Getting Started Guide
    </DcicLink>
  );
}
```