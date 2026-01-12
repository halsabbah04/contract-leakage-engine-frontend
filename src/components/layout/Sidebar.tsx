import { NavLink } from 'react-router-dom';
import { Home, FileText, AlertTriangle, List } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/upload', icon: FileText, label: 'Upload Contract' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-neutral-medium shadow-sm">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-6 mt-6 border-t border-neutral-medium">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Quick Links
          </p>
          <div className="space-y-1">
            <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600">
              <AlertTriangle size={16} />
              <span>All Findings</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600">
              <List size={16} />
              <span>All Clauses</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
