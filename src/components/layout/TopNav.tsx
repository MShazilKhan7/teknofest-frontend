import { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavLink } from '@/components/NavLink';
import { LayoutDashboard, Ticket, Settings, LogOut, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopNavProps {
  title: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  onCreateTicket?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Ticket, label: 'Tickets', path: '/tickets' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function TopNav({ title, search, onSearchChange, showSearch = true, onCreateTicket }: TopNavProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-16 flex items-center px-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Ticket className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-foreground">SupportDesk</span>
              </div>
            </div>
            <div className="p-3">
              <Button
                onClick={() => {
                  onCreateTicket?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full gradient-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>
            <nav className="px-3 py-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted"
                  activeClassName="bg-primary/10 text-primary font-medium"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Title */}
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        {showSearch && onSearchChange && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-64 bg-background"
            />
          </div>
        )}

        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="gradient-primary text-white text-sm">
                  {user?.fullName ? getInitials(user.fullName) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="gradient-primary text-white">
                  {user?.fullName ? getInitials(user.fullName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
