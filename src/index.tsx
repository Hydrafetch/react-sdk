import { createLogoClient, toDomain } from '@hydrafetch/client-sdk';
import type { Fallback, LogoType, Theme } from '@hydrafetch/client-sdk';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ImgHTMLAttributes,
  type ReactNode,
} from 'react';

export type { Fallback, LogoType, Theme };

interface LogoContextValue {
  publishableKey: string;
  baseUrl?: string;
}

const LogoContext = createContext<LogoContextValue | null>(null);

export interface HydrafetchProviderProps {
  publishableKey: string;
  baseUrl?: string;
  children: ReactNode;
}

export function HydrafetchProvider({ publishableKey, baseUrl, children }: HydrafetchProviderProps) {
  const value = useMemo(() => ({ publishableKey, baseUrl }), [publishableKey, baseUrl]);

  return <LogoContext.Provider value={value}>{children}</LogoContext.Provider>;
}

function useLogoContext(): LogoContextValue {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error(
      'Wrap your app in <HydrafetchProvider publishableKey="hf_pk_..."> before using Logo or useLogoUrl.',
    );
  }
  return context;
}

function usePrefersDark(enabled: boolean): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !window.matchMedia) return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(query.matches);

    const onChange = (event: MediaQueryListEvent) => setDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [enabled]);

  return dark;
}

export interface UseLogoUrlOptions {
  theme?: Theme;
  type?: LogoType;
  size?: number;
  fallback?: Fallback;
}

export function useLogoUrl(domain: string, options: UseLogoUrlOptions = {}): string {
  const { publishableKey, baseUrl } = useLogoContext();
  const isAuto = options.theme === 'auto';
  const prefersDark = usePrefersDark(isAuto);

  return useMemo(() => {
    const client = createLogoClient(publishableKey, baseUrl ? { baseUrl } : {});
    const theme = isAuto ? (prefersDark ? 'dark' : 'light') : options.theme;

    return client.url(domain, { ...options, theme });
  }, [publishableKey, baseUrl, domain, isAuto, prefersDark, options]);
}

export interface LogoProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  domain: string;
  size?: number;
  theme?: Theme;
  type?: LogoType;
  fallback?: Fallback;
}

export function Logo({ domain, size, theme, type, fallback, alt, ...rest }: LogoProps) {
  const { publishableKey, baseUrl } = useLogoContext();
  const isAuto = theme === 'auto';
  const prefersDark = usePrefersDark(isAuto);

  const props = useMemo(() => {
    const client = createLogoClient(publishableKey, baseUrl ? { baseUrl } : {});
    const resolved = isAuto ? (prefersDark ? 'dark' : 'light') : theme;

    return client.img(domain, { size, theme: resolved, type, fallback });
  }, [publishableKey, baseUrl, domain, size, isAuto, prefersDark, theme, type, fallback]);

  return (
    <img
      {...props}
      {...rest}
      alt={alt ?? `${toDomain(domain)} logo`}
      srcSet={props.srcSet || undefined}
    />
  );
}
