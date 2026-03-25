'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import DashboardPage from './DashboardPage'
import AnalyticsPage from './AnalyticsPage'
import UsersPage from './UsersPage'
import ContentPage from './ContentPage'
import AICoachPage from './AICoachPage'
import RevenuePage from './RevenuePage'
import NotificationsPage from './NotificationsPage'
import SettingsPage from './SettingsPage'

export default function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />
      case 'analytics':
        return <AnalyticsPage />
      case 'users':
        return <UsersPage />
      case 'content':
        return <ContentPage />
      case 'ai-coach':
        return <AICoachPage />
      case 'revenue':
        return <RevenuePage />
      case 'notifications':
        return <NotificationsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f]">
      <Sidebar activePage={activePage} setPage={setActivePage} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
