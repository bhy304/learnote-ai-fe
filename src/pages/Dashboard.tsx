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

  const isFirstTimeUser = !isLoading && dashboardData && dashboardData.totalNotes === 0;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-white">
        <DashboardSidebar activeView={activeView} onToggleView={handleToggleView} />
        <main className="flex-1 h-screen overflow-hidden bg-white transition-all flex flex-col">
          <div
            className={cn(
              'container mx-auto px-8 max-w-[1280px] h-full flex flex-col pt-16 pb-16 animate-in fade-in duration-700',
            )}
          >
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              <div className="min-h-full flex flex-col justify-center py-8">
                {activeView === 'dashboard' ? (
                  isFirstTimeUser ? (
                    <EmptyDashboard userName={user?.name || ''} />
                  ) : (
                    <div className="space-y-12">
                      <Overview />
                    </div>
                  )
                ) : (
                  <TodoView />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
