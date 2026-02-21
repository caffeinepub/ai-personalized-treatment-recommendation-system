import { Outlet } from '@tanstack/react-router';
import { Header } from './Header';
import { Footer } from './Footer';

export function PlacementLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
