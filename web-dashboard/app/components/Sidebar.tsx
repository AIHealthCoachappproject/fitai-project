'use client'

import { BarChart3, Users, Settings, Zap, AlertCircle, DollarSign, FileText } from 'lucide-react'

interface SidebarProps {
  activePage: string
  setPage: (page: string) => void
}

export default function Sidebar({ activePage, setPage }: SidebarProps) {
  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', icon: BarChart3, key: 'dashboard' },
        { label: 'Analytics', icon: BarChart3, key: 'analytics' }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Users', icon: Users, key: 'users' },
        { label: 'Content', icon: FileText, key: 'content' },
        { label: 'Activity Feed', icon: Zap, key: 'ai-coach' }
      ]
    },
    {
      title: 'BUSINESS',
      items: [
        { label: 'User Overview', icon: DollarSign, key: 'revenue' },
        { label: 'Notifications', icon: AlertCircle, key: 'notifications' },
        { label: 'Settings', icon: Settings, key: 'settings' }
      ]
    }
  ]

  return (
    <aside className="w-64 bg-[#1a1a1a] border-r border-gray-800 p-6">
      <h1 className="text-2xl font-bold text-white mb-8">FitAI</h1>

      <nav className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {section.title}
            </p>
            <ul className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = activePage === item.key
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setPage(item.key)}
                      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#22c55e] text-black'
                          : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-[#22c55e]'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
