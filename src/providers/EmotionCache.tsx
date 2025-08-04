/**
 * Emotion Cache Provider
 * 
 * This component provides SSR-compatible CSS-in-JS support using Emotion.
 * It handles CSS injection during server-side rendering and client-side hydration
 * to prevent style mismatches and ensure consistent styling.
 */

'use client';
import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

/**
 * EmotionCache Component
 * 
 * Provides Emotion cache with SSR support for CSS-in-JS styling.
 * Adapted from https://github.com/garronej/tss-react/blob/main/src/next/appDir.tsx
 * 
 * @param props - Component props including children and cache options
 */
export function EmotionCache(props: {
  children: React.ReactNode;
  options?: Parameters<typeof createCache>[0];
}) {
  const { options = { key: 'css' }, children } = props;

  // Create cache instance with SSR support
  const [registry] = React.useState(() => {
    // Create Emotion cache with provided options
    const cache = createCache(options);
    cache.compat = true; // Enable compatibility mode
    
    // Store reference to original insert function
    const prevInsert = cache.insert;
    
    // Track inserted styles for SSR
    let inserted: { name: string; isGlobal: boolean }[] = [];
    
    // Override insert function to track inserted styles
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      
      // Check if this is a global style (selector starts with '0x' and contains 'global')
      if (selector.slice(0, 2) === '0x') {
        const name = serialized.name;
        const isGlobal = selector.slice(2, 8) === 'global';
        
        // Track unique styles to avoid duplicates
        if (!inserted.some((item) => item.name === name && item.isGlobal === isGlobal)) {
          inserted.push({ name, isGlobal });
        }
      }
      
      // Call original insert function
      return prevInsert(...args);
    };
    
    // Function to flush tracked styles for SSR
    const flush = () => {
      const prevInserted = inserted;
      inserted = []; // Reset tracking array
      return prevInserted;
    };
    
    return { cache, flush };
  });

  // Inject styles during SSR
  useServerInsertedHTML(() => {
    const inserted = registry.flush();
    if (inserted.length === 0) {
      return null;
    }
    
    let styles = '';
    let dataEmotionAttribute = registry.cache.key;

    // Separate global and component styles
    const globals: { name: string; style: string }[] = [];

    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style !== 'boolean') {
        if (isGlobal) {
          // Handle global styles
          if (style !== undefined) {
            globals.push({ name, style });
          }
        } else {
          // Handle component styles
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    // Return style tags for SSR
    return (
      <React.Fragment>
        {/* Global styles */}
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${registry.cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {/* Component styles */}
        {styles && (
          <style
            data-emotion={dataEmotionAttribute}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </React.Fragment>
    );
  });

  // Provide cache to child components
  return <DefaultCacheProvider value={registry.cache}>{children}</DefaultCacheProvider>;
} 