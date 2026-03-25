'use client'

interface StatCardProps {
  title: string
  value: string | number
  sub: string
  color?: string
}

export default function StatCard({ title, value, sub, color = '#22c55e' }: StatCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
      <p className="text-sm text-gray-400 mb-4 capitalize">{title}</p>
      <p className="text-3xl font-bold mb-2" style={{ color }}>
        {value}
      </p>
      <p className="text-xs" style={{ color }}>
        {sub}
      </p>
    </div>
  )
}
