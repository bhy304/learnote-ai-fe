import { useSearchParams } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
import EmptyDashboard from '@/components/dashboard/EmptyDashboard';
import { useAuthStore } from '@/store/authStore';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/common/Sidebar';
import Overview from '@/components/dashboard/Overview';
import TodoView from '@/components/dashboard/TodoView';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'dashboard';

  const handleToggleView = (view: string) => {
    setSearchParams({ view });
  };

  const user = useAuthStore((state) => state.user);

  const { data: dashboardData, isLoading } = useDashboard();

  const isFirstTimeUser = !isLoading && dashboardData?.totalNotes === 0;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-full w-full overflow-hidden bg-white">
        <DashboardSidebar activeView={activeView} onToggleView={handleToggleView} />
        <main className="flex-1 h-screen overflow-hidden bg-white transition-all flex flex-col">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div
              className={cn(
                'container mx-auto px-4 md:px-8 max-w-[1280px] min-h-full flex flex-col pt-8 md:pt-16 pb-8 animate-in fade-in duration-700',
              )}
            >
              {activeView === 'dashboard' ? (
                isFirstTimeUser ? (
                  <div className="min-h-[calc(100vh-128px)] flex flex-col justify-center">
                    <EmptyDashboard userName={user?.name || ''} />
                  </div>
                ) : (
                  <div className="space-y-6 md:space-y-8">
                    <Overview />
                  </div>
                )
              ) : (
                <TodoView />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
