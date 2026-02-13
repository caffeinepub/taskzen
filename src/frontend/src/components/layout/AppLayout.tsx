import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
