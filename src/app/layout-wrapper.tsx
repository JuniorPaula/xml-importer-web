'use client'

import { useSidebar } from '@/context/sidebar-context'
import Sidebar from './sidebar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { collapsed, isMobile } = useSidebar()

  const marginLeft = isMobile ? 'ml-0' : collapsed ? 'ml-16' : 'ml-64'

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main
        className={`flex-1 p-6 overflow-auto transition-all duration-200 ${marginLeft}`}
      >
        {children}
      </main>
    </div>
  )
}
