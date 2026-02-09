import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="terminal-layout">
      <div className="scanlines" />
      <Header />
      <main className="terminal-main">{children}</main>
      <Footer />
    </div>
  );
}
