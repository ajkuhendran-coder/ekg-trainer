import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  BookOpen,
  Stethoscope,
  GraduationCap,
  BarChart3,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/lernen', label: 'Lernen', icon: BookOpen },
  { to: '/faelle', label: 'Fälle', icon: Stethoscope },
  { to: '/pruefung', label: 'Prüfung', icon: GraduationCap },
] as const;

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* ── Top Header Bar ── */}
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center gap-3 md:hidden shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-7 h-7 text-rose-500 animate-pulse-ekg" />
          <div>
            <h1 className="text-lg font-bold leading-tight">EKG-Trainer</h1>
            <p className="text-[11px] text-slate-400 leading-tight">
              Anästhesie-Edition
            </p>
          </div>
        </div>
      </header>

      {/* ── Side Navigation (md+) ── */}
      <nav className="hidden md:flex flex-col w-56 bg-slate-900 text-white shrink-0 min-h-screen">
        <div className="px-5 py-6 flex items-center gap-3 border-b border-slate-700">
          <Activity className="w-8 h-8 text-rose-500 animate-pulse-ekg" />
          <div>
            <h1 className="text-lg font-bold leading-tight">EKG-Trainer</h1>
            <p className="text-xs text-slate-400 leading-tight">
              Anästhesie-Edition
            </p>
          </div>
        </div>

        <div className="flex-1 py-4 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-600/20 text-teal-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-slate-700 text-xs text-slate-500">
          Version 1.0
        </div>
      </nav>

      {/* ── Main content area ── */}
      <main className="flex-1 pb-20 md:pb-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-5 md:px-6 md:py-6">
          {children}
        </div>
      </main>

      {/* ── Bottom tab bar (small screens) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center px-1 py-1 z-50">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[52px] rounded-lg text-[11px] font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-teal-600'
                  : 'text-slate-400 active:text-slate-600'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
