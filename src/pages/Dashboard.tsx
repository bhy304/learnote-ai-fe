import { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import EmptyDashboard from '@/components/dashboard/EmptyDashboard';
import { useAuthStore } from '@/store/authStore';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/common/Sidebar';
import Overview from '@/components/dashboard/Overview';
import TodoView from '@/components/dashboard/TodoView';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const user = useAuthStore((state) => state.user);

  const { data: dashboardData, isLoading } = useDashboard();

  const isFirstTimeUser = !isLoading && dashboardData && dashboardData.totalNotes === 0;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-white">
        <DashboardSidebar activeView={activeView} onToggleView={setActiveView} />
        <main className="flex-1 overflow-y-auto pt-10">
          <div className="container mx-auto px-8 max-w-[1280px] space-y-12 animate-in fade-in duration-700 pb-24">
            {activeView === 'dashboard' ? (
              isFirstTimeUser ? (
                <EmptyDashboard userName={user?.name || ''} />
              ) : (
                <Overview />
              )
            ) : (
              <TodoView />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
