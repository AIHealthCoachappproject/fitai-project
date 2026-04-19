'use client'

import {
  useDashboard,
  type DashboardProfile,
  type DashboardMealLog,
  type DashboardWorkoutLog,
  type DashboardWeightLog,
  type DashboardStats,
} from '../hooks/useDashboard'
import StatCard from './StatCard'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import DataTable from './DataTable'
import ChartContainer from './ChartContainer'

// --- Config: Stat Cards ---

const statsConfig: { title: string; key: keyof DashboardStats; sub: string; color: string }[] = [
  { title: 'Total Users', key: 'totalUsers', sub: 'Registered users', color: '#22c55e' },
  { title: 'Meal Logs', key: 'totalMeals', sub: 'Total meals logged', color: '#f59e0b' },
  { title: 'Workout Logs', key: 'totalWorkouts', sub: 'Total workouts logged', color: '#ef4444' },
  { title: 'Weight Logs', key: 'totalWeightLogs', sub: 'Weight entries', color: '#8b5cf6' },
]

// --- Config: Table Columns ---

const userColumns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'email' as const, header: 'Email' },
  { key: 'goal' as const, header: 'Goal', render: (v: string) => (v ?? '').replace('_', ' ').toUpperCase() },
  { key: 'weight' as const, header: 'Weight', render: (v: number) => v ? `${v} kg` : '—' },
  { key: 'plan' as const, header: 'Plan', render: (v: string) => (v ?? 'free').toUpperCase() },
  { key: 'created_at' as const, header: 'Joined', render: (v: string) => new Date(v).toLocaleDateString() },
]

const mealColumns = [
  { key: 'user_name' as const, header: 'User' },
  { key: 'food_name' as const, header: 'Food' },
  { key: 'calories' as const, header: 'Calories', render: (v: number) => `${v} kcal` },
  { key: 'protein_g' as const, header: 'Protein', render: (v: number) => `${v}g` },
  { key: 'logged_at' as const, header: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
]

const workoutColumns = [
  { key: 'user_name' as const, header: 'User' },
  { key: 'title' as const, header: 'Workout' },
  { key: 'duration' as const, header: 'Duration', render: (v: number) => `${v} min` },
  {
    key: 'completed' as const,
    header: 'Status',
    render: (v: boolean) => (
      <span className={v ? 'text-[#22c55e]' : 'text-gray-400'}>{v ? 'Completed' : 'Pending'}</span>
    ),
  },
  { key: 'created_at' as const, header: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
]

const weightLogColumns = [
  { key: 'user_name' as const, header: 'User' },
  { key: 'weight_kg' as const, header: 'Weight', render: (v: number) => `${v} kg` },
  { key: 'bmi' as const, header: 'BMI', render: (v: number) => v ? v.toFixed(1) : '—' },
  { key: 'logged_at' as const, header: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
]

// --- Component ---

export default function DashboardPage() {
  const { data, loading, error } = useDashboard()

  if (loading) return <LoadingSpinner className="h-64" />
  if (error) return <ErrorMessage message={error} />
  if (!data) return null

  const tableEntries = [
    { title: 'Users', render: () => <DataTable<DashboardProfile> data={data.users} columns={userColumns} /> },
    { title: 'Meal Logs', render: () => <DataTable<DashboardMealLog> data={data.meals} columns={mealColumns} /> },
    { title: 'Workout Logs', render: () => <DataTable<DashboardWorkoutLog> data={data.workouts} columns={workoutColumns} /> },
    { title: 'Weight Logs', render: () => <DataTable<DashboardWeightLog> data={data.weightLogs} columns={weightLogColumns} /> },
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
            value={data.stats[stat.key].toLocaleString()}
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