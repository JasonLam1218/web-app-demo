import type { Metadata } from 'next';
import '@/app/globals.css';
import ThemeRegistry from '@/providers/ThemeRegistry';

export const metadata: Metadata = {
  title: 'EduAI - Your Learning Assistant',
  description: 'EduAI helps students learn more effectively with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
