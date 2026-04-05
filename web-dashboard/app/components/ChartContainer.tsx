import React from 'react'

interface ChartContainerProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function ChartContainer({ title, children, className = '' }: ChartContainerProps) {
  return (
    <div className={`bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}