import { NavLink } from 'react-router-dom';
import { cn } from '@/utils';
import { Avatar } from '@/components';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  {
    to: '/dashboard',
    label: 'Home',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    to: '/pay',
    label: 'Pay',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    to: '/groups',
    label: 'Groups',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    to: '/expenses',
    label: 'Activity',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    to: '/admin',
    label: 'Bank',
    adminOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="12" x="2" y="9" rx="2" />
        <path d="M11 15h2" />
        <path d="M15 15h2" />
        <path d="M7 15h2" />
        <path d="M2 9h20" />
        <path d="M5 5h14" />
        <path d="M8 2h8" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  
  const filteredNavItems = navItems.filter(item => !item.adminOnly || (user && user.role === 'admin'));

  return (
    <aside className="hidden md:flex w-64 bg-surface-raised border-r border-border flex-col h-screen sticky top-0 shrink-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-border">
        <h2 className="text-[22px] font-bold text-text-primary tracking-tight">
          PayBud
        </h2>
        <p className="text-[12px] text-text-tertiary mt-0.5">
          Split smart, pay easy
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-[14.5px] font-medium transition-all duration-200 active:scale-[0.98]',
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm font-semibold'
                  : 'text-text-secondary hover:bg-surface-sunken hover:text-text-primary'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-5 py-4 border-t border-border">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]',
              isActive
                ? 'bg-primary-50 shadow-sm'
                : 'hover:bg-surface-sunken'
            )
          }
        >
          <Avatar name={user?.name || "User"} size="sm" />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-text-primary truncate">
              {user?.name || "Sign In"}
            </p>
            <p className="text-[12px] text-text-tertiary truncate">
              {user?.email || "No email"}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
