import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import { ToastContainer } from '@/components';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface md:bg-surface-sunken flex justify-center md:justify-start">
      <Sidebar />
      {/* Container adapts: on mobile it fills and uses BottomNav, on desktop it feels like a structured web dashboard */}
      <div className="w-full md:flex-1 md:max-w-none md:shadow-none max-w-md bg-surface min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col md:border-x-0 border-x border-border md:rounded-tl-2xl">
        <main className="flex-1 pb-24 md:pb-8 overflow-y-auto overflow-x-hidden relative scroll-smooth mx-auto w-full max-w-5xl">
          <Outlet />
        </main>
        <div className="md:hidden">
          <BottomNav />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
