import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Layers, 
  Activity, 
  Radio, 
  Settings,
  LogOut,
  User
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentWorkflow } = useWorkflow();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'execution', label: 'Tasks', icon: CheckSquare, badge: currentWorkflow ? '1' : undefined },
    { id: 'automations', label: 'Automations', icon: Layers },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'connected', label: 'Integrations', icon: Radio },
  ];

  return (
    <aside className="w-56 border-r border-border-subtle bg-background-surface flex flex-col justify-between p-3 min-h-screen select-none shrink-0 font-sans">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <img 
            src="/logo.png" 
            alt="OrkaAI" 
            className="w-6 h-6 rounded object-cover" 
          />
          <span className="font-semibold text-sm tracking-tight text-text-primary">OrkaAI</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-background-elevated text-text-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-text-muted" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-text-primary text-background-card">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings & Account */}
      <div className="pt-3 border-t border-border-subtle space-y-0.5">
        <button
          onClick={() => setActiveTab('connected')}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-background-elevated/50 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-text-muted" />
          <span>Settings</span>
        </button>

        {user && (
          <div className="flex items-center justify-between px-2.5 py-2 mt-1 rounded-md bg-background-elevated/50 text-xs">
            <div className="flex items-center gap-2 truncate">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
              ) : (
                <User className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className="text-text-primary font-medium truncate text-[11px]">{user.name}</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-text-muted hover:text-rose-600 p-1 rounded cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
