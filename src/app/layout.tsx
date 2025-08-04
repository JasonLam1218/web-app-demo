/**
 * Root Layout Component
 * 
 * This is the root layout for the EduAI application. It wraps all pages and provides
 * the basic HTML structure, metadata, and theme provider.
 */

import type { Metadata } from 'next';
import '@/app/globals.css';
import ThemeRegistry from '@/providers/ThemeRegistry';

// Application metadata for SEO and browser display
export const metadata: Metadata = {
  title: 'EduAI - Your Learning Assistant',
  description: 'EduAI helps students learn more effectively with AI',
};

/**
 * RootLayout Component
 * 
 * Provides the base HTML structure for all pages in the application.
 * Wraps content with the ThemeRegistry for Material-UI theming support.
 * 
 * @param children - React components to be rendered within the layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ThemeRegistry provides Material-UI theme context and Emotion cache */}
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
