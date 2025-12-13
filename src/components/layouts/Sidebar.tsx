'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  School,
  Camera,
  Users,
  Settings,
  GraduationCap,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Escolas',
    href: '/dashboard/school',
    icon: <School className="h-5 w-5" />,
  },
  {
    name: 'Turmas',
    href: '/dashboard/school/classes',
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    name: 'Sessões',
    href: '/dashboard/school/sessions',
    icon: <Camera className="h-5 w-5" />,
  },
  {
    name: 'Alunos',
    href: '/dashboard/school/students',
    icon: <Users className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-primary-600" />
          <span className="text-xl font-bold">Snap-Self</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10',
              },
            }}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Modo Escola</p>
            <p className="text-xs text-gray-500">Fotografia Escolar</p>
          </div>
        </div>

        <Link
          href="/dashboard/settings"
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
          Configurações
        </Link>
      </div>
    </div>
  );
}
