# Spektr

Design spec overlay for React. Hold Alt and hover any element to inspect spacing, typography, and colors — like Figma Inspect, but in the browser.

## Installation

```bash
npm i @andrewaitken/spektr
```

Requires **React 18+**.

## Usage

Wrap your app (or any section) with `<Spektr>`:

```tsx
import { Spektr } from '@andrewaitken/spektr';

function App() {
  return (
    <Spektr>
      <YourApp />
    </Spektr>
  );
}
```

Then hold **Alt** and hover any element.

### What you see

- **Blue outline** — element boundary with dimensions
- **Green overlay** — padding areas
- **Orange overlay** — margin areas
- **Spec tooltip** — typography (font, size, weight, line-height, color), spacing (padding, margin, gap), visual properties (background, border-radius, shadow), and layout info

### Pin inspections

**Alt+click** on any element to pin the overlay. **Alt+click** again to unpin.

### Development-only

```tsx
<Spektr enabled={process.env.NODE_ENV === 'development'}>
  <YourApp />
</Spektr>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the overlay |
| `children` | `ReactNode` | — | Your app content |

## How it works

Spektr uses `getComputedStyle()` and `getBoundingClientRect()` to read the actual rendered properties of any element. The overlay is rendered via React Portal so it doesn't interfere with your app's layout or z-index.

No CSS files needed — all styles are inline.

## Features

- Zero dependencies (only React peer dep)
- No CSS imports required
- TypeScript support with full type exports
- Portal-based overlay (no z-index conflicts)
- Works with Alt key (Option on Mac)
- Pin/unpin inspections
- Responsive tooltip positioning
- Box model visualization (padding, margin, dimensions)

## Exports

```tsx
// Component
import { Spektr } from '@andrewaitken/spektr';

// Utilities (for custom integrations)
import { computeSpecs, formatColor, formatSides, hasMeaningfulValue } from '@andrewaitken/spektr';

// Types
import type { SpektrProps, ElementSpecs, BoxSides } from '@andrewaitken/spektr';
```

## Development

```bash
git clone https://github.com/AndrewAntoshkin/spektr.git
cd spektr
npm install

# Build the component
npm run build

# Run tests
npm test

# Demo website
cd website && npm install && npm run dev
```

## License

MIT
