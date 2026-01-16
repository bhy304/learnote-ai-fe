import { useNavigate } from 'react-router-dom';
import { Home, FileText, LogOut, User, ChevronsUpDown } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo.png';
import { useQueryClient } from '@tanstack/react-query';

const items = [
  { id: 'dashboard', title: 'Dashboard', icon: Home },
  { id: 'todos', title: 'Todos', icon: FileText },
];

interface SidebarProps {
  activeView: string;
  onToggleView: (view: string) => void;
}

export default function DashboardSidebar({ activeView, onToggleView }: SidebarProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    queryClient.clear(); // 이전 유저나 이전 세션의 캐시 데이터를 완전히 삭제
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 shadow-none bg-white">
      <SidebarHeader className="h-16 flex flex-row items-center justify-between px-4 border-b border-slate-50 bg-white group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-2 font-bold text-slate-900 group-data-[collapsible=icon]:hidden overflow-hidden whitespace-nowrap">
          <img src={logo} alt="Learnote Logo" className="h-6 w-auto object-contain" />
          {/* <span className="text-sm tracking-tight text-slate-700">Learnote AI</span> */}
        </div>
        <SidebarTrigger className="cursor-pointer hover:bg-slate-100 rounded-md transition-colors" />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-medium px-4 py-2 mt-2 group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 group-data-[collapsible=icon]:px-0">
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeView === item.id}
                    onClick={() => onToggleView(item.id)}
                    className={`hover:bg-slate-100/80 active:bg-slate-200 transition-colors group-data-[collapsible=icon]:justify-center ${
                      activeView === item.id ? 'bg-slate-100 text-slate-900' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="size-4 shrink-0" />
                      <span className="font-medium group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-50 p-2 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded shrink-0">
                    <AvatarFallback className="rounded-full bg-slate-100 text-slate-600 font-bold">
                      {user?.name?.[0] || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs text-slate-500">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-full bg-slate-100 text-slate-600 font-bold">
                        {user?.name?.[0] || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs text-slate-500">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer ">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
