import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOutIcon, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="mx-auto flex w-full max-w-[1200px] justify-between py-4 items-center px-4">
      <Link to="/">
        <img src={logo} alt="Learnote Logo" className="h-6 w-auto object-contain" />
      </Link>
      <nav className="flex items-center justify-center">
        {user && (
          <ul className="w-8 h-8">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {user?.name?.[0] || <User className="w-8 h-8" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
