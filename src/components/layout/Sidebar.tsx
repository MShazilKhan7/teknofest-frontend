import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { LayoutDashboard, Ticket, Plus, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onCreateTicket: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Ticket, label: 'Tickets', path: '/tickets' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ onCreateTicket }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 flex flex-col bg-card border-r border-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Ticket className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">SupportDesk</span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary mx-auto">
            <Ticket className="h-4 w-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground',
            collapsed && 'absolute -right-3 top-6 bg-card border border-border shadow-sm'
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Create Ticket Button */}
      <div className="p-3">
        <Button
          onClick={onCreateTicket}
          className={cn(
            'w-full gradient-primary text-white',
            collapsed ? 'px-0' : ''
          )}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Create Ticket</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'text-muted-foreground hover:text-foreground hover:bg-muted',
                collapsed && 'justify-center px-0'
              )}
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200',
            'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
