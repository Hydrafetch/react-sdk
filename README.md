# @hydrafetch/react

[![npm](https://img.shields.io/npm/v/@hydrafetch/react)](https://www.npmjs.com/package/@hydrafetch/react)
[![CI](https://github.com/Hydrafetch/react-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Hydrafetch/react-sdk/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@hydrafetch/react)](https://bundlephobia.com/package/@hydrafetch/react)

React components for company logos, powered by a [Hydrafetch](https://hydrafetch.com) publishable key.

738 bytes gzipped. React is a peer dependency. Logos bill against logo pulls, not credits.

## Installation

```bash
npm install @hydrafetch/react
```

## Quick start

```tsx
import { HydrafetchProvider, Logo } from '@hydrafetch/react';

export default function App() {
  return (
    <HydrafetchProvider publishableKey={process.env.NEXT_PUBLIC_HYDRAFETCH_PK!}>
      <Logo domain="stripe.com" size={32} theme="auto" />
    </HydrafetchProvider>
  );
}
```

Create a publishable key in your [dashboard](https://app.hydrafetch.com) and restrict it to your domains.

## Components

### `<HydrafetchProvider>`

Holds the key so it is not repeated at every call site.

```tsx
<HydrafetchProvider publishableKey="hf_pk_..." baseUrl="https://img.hydrafetch.com">
  {children}
</HydrafetchProvider>
```

Throws on any key that does not begin with `hf_pk_`, which prevents a secret key reaching a browser bundle.

### `<Logo>`

```tsx
<Logo domain="stripe.com" size={32} theme="auto" type="icon" fallback="monogram" className="rounded" />
```

| Prop | Values | Notes |
| --- | --- | --- |
| `domain` | required | `https://www.stripe.com/pricing` is normalised to `stripe.com` |
| `size` | pixels, up to 512 | adds a 2x `srcSet` |
| `theme` | `light`, `dark`, `auto` | `auto` follows the system preference |
| `type` | `icon`, `wordmark` | defaults to the mark |
| `fallback` | `monogram`, `404`, `transparent` | what an unknown domain returns |

Any other image attribute passes through. `alt` defaults to `"{domain} logo"` and can be overridden.

`theme="auto"` reads `prefers-color-scheme` in the browser and re-renders when the user changes it, which a server-rendered URL cannot do.

### `useLogoUrl(domain, options?)`

Returns the URL string, for background images or a framework's own image component.

```tsx
const src = useLogoUrl('stripe.com', { size: 64, theme: 'auto' });
```

## Server components

`<Logo>` is a client component because it reads `prefers-color-scheme`. In a React Server Component, either place it behind a `'use client'` boundary, or render a plain image with an explicit theme:

```tsx
<img src={`https://img.hydrafetch.com/logo/${domain}?token=${KEY}&size=32&theme=dark`} />
```

## Billing

Logos are metered against `logoPullsPerCycle` on your plan and never draw on your credit balance, so rendering logos on every page view does not consume the budget used for scraping.

## Related packages

- [`@hydrafetch/client-sdk`](https://github.com/Hydrafetch/client-sdk) — the same URL builder without React, 614 bytes
- Server clients for the full API: [Node](https://github.com/Hydrafetch/node-sdk) · [Python](https://github.com/Hydrafetch/python-sdk) · [Go](https://github.com/Hydrafetch/go-sdk) · [Ruby](https://github.com/Hydrafetch/ruby-sdk) · [Rust](https://github.com/Hydrafetch/rust-sdk) · [PHP](https://github.com/Hydrafetch/php-sdk)

## Links

- [Documentation](https://docs.hydrafetch.com)
- [OpenAPI specification](https://api.hydrafetch.com/openapi.json)

## License

MIT
