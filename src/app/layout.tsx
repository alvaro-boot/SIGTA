import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIGTA',
  description: 'Sistema de gestión de tutorías',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
