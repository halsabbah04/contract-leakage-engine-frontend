import { NavLink } from 'react-router-dom';
import { Home, FileText, History } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/upload', icon: FileText, label: 'Upload Contract' },
  { to: '/contracts', icon: History, label: 'Upload History' },
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
      </nav>
    </aside>
  );
}
