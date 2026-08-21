import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HydrafetchProvider, Logo } from '../src/index.js';

const KEY = 'hf_pk_test123';

function mockColorScheme(dark: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches: dark,
    addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => listeners.delete(fn),
  };
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql));
  return {
    change(next: boolean) {
      mql.matches = next;
      for (const fn of listeners) fn({ matches: next } as MediaQueryListEvent);
    },
  };
}

function renderLogo(ui: React.ReactElement) {
  return render(<HydrafetchProvider publishableKey={KEY}>{ui}</HydrafetchProvider>);
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Logo', () => {
  it('renders an img pointing at the logo endpoint', () => {
    renderLogo(<Logo domain="stripe.com" />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toContain('/logo/stripe.com?token=hf_pk_test123');
  });

  it('derives alt text from the domain', () => {
    renderLogo(<Logo domain="https://www.stripe.com/pricing" />);
    expect(screen.getByAltText('stripe.com logo')).toBeDefined();
  });

  it('lets a caller override alt text', () => {
    renderLogo(<Logo domain="stripe.com" alt="Stripe" />);
    expect(screen.getByAltText('Stripe')).toBeDefined();
  });

  it('adds a retina srcSet when a size is given', () => {
    renderLogo(<Logo domain="stripe.com" size={32} />);
    const srcSet = screen.getByRole('img').getAttribute('srcset') ?? '';
    expect(srcSet).toContain('size=32 1x');
    expect(srcSet).toContain('size=64 2x');
  });

  it('omits srcSet entirely when there is no size to scale', () => {
    renderLogo(<Logo domain="stripe.com" />);
    expect(screen.getByRole('img').getAttribute('srcset')).toBeNull();
  });

  it('passes through extra img attributes', () => {
    renderLogo(<Logo domain="stripe.com" className="rounded" data-testid="logo" />);
    expect(screen.getByTestId('logo').getAttribute('class')).toBe('rounded');
  });

  it('resolves theme="auto" to dark when the system prefers dark', () => {
    mockColorScheme(true);
    renderLogo(<Logo domain="stripe.com" theme="auto" />);
    expect(screen.getByRole('img').getAttribute('src')).toContain('theme=dark');
  });

  it('resolves theme="auto" to light when the system prefers light', () => {
    mockColorScheme(false);
    renderLogo(<Logo domain="stripe.com" theme="auto" />);
    expect(screen.getByRole('img').getAttribute('src')).toContain('theme=light');
  });

  it('sends an explicit theme through untouched', () => {
    renderLogo(<Logo domain="stripe.com" theme="dark" />);
    expect(screen.getByRole('img').getAttribute('src')).toContain('theme=dark');
  });

  it('explains what to do when the provider is missing', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Logo domain="stripe.com" />)).toThrow(/HydrafetchProvider/);
    quiet.mockRestore();
  });
});
