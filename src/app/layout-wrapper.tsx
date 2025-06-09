'use client'

import { useSidebar } from '@/context/sidebar-context'
import Sidebar from './sidebar'
import { usePathname } from 'next/navigation'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { collapsed, isMobile } = useSidebar()
  const pathname = usePathname()

  const isPublicRoute = ["/login", "/register"].includes(pathname)

  const marginLeft = isMobile || isPublicRoute ? 'ml-0' : collapsed ? 'ml-16' : 'ml-64'

  return (
    <div className="flex min-h-screen w-full">
      { !isPublicRoute && <Sidebar /> }
      <main
        className={`flex-1 p-6 overflow-auto transition-all duration-200 ${marginLeft} bg-gray-50`}
      >
        {children}
      </main>
    </div>
  )
}
