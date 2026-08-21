# @hydrafetch/react

Company logos in React, from a [Hydrafetch](https://hydrafetch.com) publishable key.

**738 bytes gzipped.** React is a peer dependency; the only real dependency is [`@hydrafetch/client-sdk`](https://github.com/Hydrafetch/client-sdk) at another 614 bytes.

Logos bill against your plan's **logo pulls**, not credits.

```bash
npm install @hydrafetch/react
```

## Quick start

```tsx
import { HydrafetchProvider, Logo } from '@hydrafetch/react';

export default function App() {
  return (
    <HydrafetchProvider publishableKey={process.env.NEXT_PUBLIC_HYDRAFETCH_PK!}>
      <Logo domain="stripe.com" size={32} />
    </HydrafetchProvider>
  );
}
```

Get a publishable key in your [dashboard](https://app.hydrafetch.com), and lock it to your domains while you are there.

## You may not need this

The logo endpoint serves the image itself, so a plain `<img>` already works:

```tsx
<img src={`https://img.hydrafetch.com/logo/${domain}?token=${KEY}&size=32`} />
```

This package earns its ~700 bytes with three things that string cannot do:

- **The key is set once** at the provider, not repeated at every call site.
- **`theme="auto"` resolves in the browser** from `prefers-color-scheme`, and re-renders when the user switches. A server cannot know which one to send.
- **Retina `srcSet`, lazy loading and alt text** come out right by default.

If none of those matter to you, use the plain `<img>`. It is a supported way to use the product, not a workaround.

## Logo pulls, not credits

Logos are metered against `logoPullsPerCycle` on your plan and never touch your credit balance, so rendering a logo on every page view does not eat the budget you use for scraping.

## Components

### `<HydrafetchProvider>`

```tsx
<HydrafetchProvider publishableKey="hf_pk_..." baseUrl="https://img.hydrafetch.com">
  {children}
</HydrafetchProvider>
```

Throws if handed anything that does not start with `hf_pk_`, so a secret key cannot reach your bundle by accident.

### `<Logo>`

```tsx
<Logo domain="stripe.com" size={32} theme="auto" type="icon" fallback="monogram" className="rounded" />
```

| Prop | Values | Notes |
| --- | --- | --- |
| `domain` | required | `https://www.stripe.com/pricing` is normalised to `stripe.com` |
| `size` | pixels | adds a 2x `srcSet` |
| `theme` | `light`, `dark`, `auto` | `auto` follows the system, live |
| `type` | `icon`, `wordmark` | defaults to the mark |
| `fallback` | `monogram`, `404`, `transparent` | what a domain with no logo returns |

Any other `<img>` prop passes straight through. `alt` defaults to `"{domain} logo"` and is overridable.

### `useLogoUrl(domain, options?)`

For a background image, an `<Image>` from a framework, or anywhere you need the string rather than an element:

```tsx
const src = useLogoUrl('stripe.com', { size: 64, theme: 'auto' });
```

## Server components

`<Logo>` is a client component: it reads `prefers-color-scheme`, so it needs the browser. In a React Server Component, either mark the boundary with `'use client'`, or skip this package and render the plain `<img>` shown above with an explicit `theme`.

## Not using React?

- [`@hydrafetch/client-sdk`](https://github.com/Hydrafetch/client-sdk) — the same URL builder, framework-free, 614 bytes
- Or write the URL yourself. It is one line.

For a company's full brand record, colours, fonts and socials, use a server-side client with a secret key: [Node](https://github.com/Hydrafetch/node-sdk) · [Python](https://github.com/Hydrafetch/python-sdk) · [Go](https://github.com/Hydrafetch/go-sdk) · [Ruby](https://github.com/Hydrafetch/ruby-sdk) · [Rust](https://github.com/Hydrafetch/rust-sdk) · [PHP](https://github.com/Hydrafetch/php-sdk)

MIT licensed.
