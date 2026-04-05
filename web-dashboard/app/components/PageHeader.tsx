'use client'

interface PageHeaderProps {
  title: string
  subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
    </div>
  )
}