'use client'

import { useDashboard, DashboardMetrics, RecentUser, RecentWorkout, RecentChat, WeightLog, WorkoutPlan } from '../hooks/useDashboard'
import StatCard from './StatCard'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import DataTable from './DataTable'
import ChartContainer from './ChartContainer'

// --- Config: Stat Cards ---

const statsConfig: { title: string; key: keyof DashboardMetrics; sub: string; color: string }[] = [
  { title: 'Total Users', key: 'totalUsers', sub: 'Registered users', color: '#22c55e' },
  { title: 'Active Today', key: 'activeUsersToday', sub: 'Users active today', color: '#3b82f6' },
  { title: 'Food Logs', key: 'foodLogsToday', sub: 'Logs recorded today', color: '#f59e0b' },
  { title: 'Workouts', key: 'workoutsToday', sub: 'Completed today', color: '#ef4444' },
  { title: 'AI Chats', key: 'aiChatsToday', sub: 'Chat interactions', color: '#8b5cf6' },
  { title: 'Active Plans', key: 'activePlans', sub: 'Workout plans', color: '#06b6d4' },
  { title: 'Inactive Users', key: 'inactiveUsers', sub: 'No activity in 3 days', color: '#ec4899' },
  { title: 'Calorie Imbalance', key: 'calorieImbalance', sub: 'Exceeded by 500+ cal', color: '#f97316' },
  { title: 'Weight Alerts', key: 'weightAlerts', sub: 'Sudden weight changes', color: '#d946ef' },
]

// --- Config: Table Columns ---

const userColumns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'email' as const, header: 'Email' },
  { key: 'goal' as const, header: 'Goal', render: (v: string) => v.replace('_', ' ').toUpperCase() },
  { key: 'created_at' as const, header: 'Joined', render: (v: string) => new Date(v).toLocaleDateString() },
]

const workoutColumns = [
  { key: 'userName' as const, header: 'User' },
  { key: 'title' as const, header: 'Workout' },
  { key: 'duration' as const, header: 'Duration', render: (v: number) => `${v} min` },
  {
    key: 'completed' as const,
    header: 'Status',
    render: (v: boolean) => (
      <span className={v ? 'text-[#22c55e]' : 'text-gray-400'}>{v ? 'Completed' : 'Pending'}</span>
    ),
  },
]

const chatColumns = [
  { key: 'userName' as const, header: 'User' },
  { key: 'message' as const, header: 'Message' },
  { key: 'role' as const, header: 'Role' },
  { key: 'created_at' as const, header: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
]

const weightLogColumns = [
  { key: 'userName' as const, header: 'User' },
  { key: 'weight_kg' as const, header: 'Weight', render: (v: number) => `${v} kg` },
  { key: 'bmi' as const, header: 'BMI', render: (v: number) => v.toFixed(1) },
  { key: 'logged_at' as const, header: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
]

const workoutPlanColumns = [
  { key: 'userName' as const, header: 'User' },
  { key: 'plan_name' as const, header: 'Plan Name' },
  { key: 'goal_type' as const, header: 'Goal', render: (v: string) => v.replace('_', ' ').toUpperCase() },
  { key: 'days_per_week' as const, header: 'Days/Week', render: (v: number) => `${v} days` },
  {
    key: 'is_active' as const,
    header: 'Status',
    render: (v: boolean) => (
      <span className={v ? 'text-[#22c55e]' : 'text-gray-400'}>{v ? 'Active' : 'Inactive'}</span>
    ),
  },
]

// --- Component ---

export default function DashboardPage() {
  const { data, loading, error } = useDashboard()

  if (loading) return <LoadingSpinner className="h-64" />
  if (error) return <ErrorMessage message={error} />
  if (!data) return null

  const tableEntries = [
    { title: 'Recent Users', render: () => <DataTable<RecentUser> data={data.recentUsers} columns={userColumns} /> },
    { title: 'Recent Workouts', render: () => <DataTable<RecentWorkout> data={data.recentWorkouts} columns={workoutColumns} /> },
    { title: 'Latest Weight Logs', render: () => <DataTable<WeightLog> data={data.weightLogs} columns={weightLogColumns} /> },
    { title: 'Active Workout Plans', render: () => <DataTable<WorkoutPlan> data={data.workoutPlans} columns={workoutPlanColumns} /> },
    { title: 'AI Chats', render: () => <DataTable<RecentChat> data={data.recentChats} columns={chatColumns} /> },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" subtitle="FitAI Health Coach Admin Overview" />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={data.metrics[stat.key].toLocaleString()}
            sub={stat.sub}
            color={stat.color}
          />
        ))}
      </div>

      {/* Data Tables */}
      {tableEntries.map((table) => (
        <ChartContainer key={table.title} title={table.title}>
          {table.render()}
        </ChartContainer>
      ))}
    </div>
  )
}