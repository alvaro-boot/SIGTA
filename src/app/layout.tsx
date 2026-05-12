import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIGTA · UTP',
  description: 'Sistema de gestión de tutorías — Universidad Tecnológica de Pereira',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
