'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/context/sidebar-context'
import { FileText, LayoutDashboard, ListOrdered, LogOut, Package, Upload, User, Users } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

const menuItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Clientes', path: '/customers', icon: Users },
  { label: 'Produtos', path: '/products', icon: Package },
  { label: 'Notas Fiscais', path: '/invoices', icon: FileText },
  { label: 'Itens', path: '/invoice-items', icon: ListOrdered },
  { label: 'Importar XML', path: '/import', icon: Upload },
  { label: 'Usuário', path: '/user', icon: User },
]

export default function Sidebar() {
  const { logout } = useAuth();

  const pathname = usePathname()
  const {
    collapsed,
    isMobile,
    showSidebar,
    toggleSidebar,
    closeSidebar,
  } = useSidebar()

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 text-white bg-gray-800 px-3 py-2 rounded-md shadow-md"
        >
          {showSidebar ? '✖' : '☰'}
        </button>
      )}

      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed z-50 top-0 left-0 h-full ${collapsed ? 'w-16' : 'w-64'
          } bg-gray-900 text-white p-4 space-y-4 transition-all duration-200 ${isMobile ? (showSidebar ? 'block' : 'hidden') : 'block'
          }`}
      >
        <div className="flex justify-between items-center mb-6">
          {!collapsed && <h1 className="text-xl font-bold">eNube</h1>}
          <button
            onClick={toggleSidebar}
            className="text-white p-1 bg-gray-700 hover:bg-gray-600 rounded"
          >
            {collapsed ? '➤' : '◀'}
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              onClick={closeSidebar}
              className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${pathname === path ? 'bg-gray-800 font-semibold' : ''
                } ${collapsed ? 'justify-center' : ''}`}
            >
              <div className="flex items-center justify-center w-6 h-6">
                <Icon size={20} className="text-white" />
              </div>
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}

          <a
            className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${collapsed ? 'justify-center' : ''}`}
            onClick={logout}
          >
            <div className="flex items-center justify-center w-6 h-6">
              <LogOut size={20} className="text-red-500" />
            </div>
            {!collapsed && <span className="text-red-500">Sair</span>}
          </a>
        </nav>
      </aside>
    </>
  )
}
