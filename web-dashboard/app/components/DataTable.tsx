import React from 'react'

interface Column<T> {
  key: keyof T
  header: string
  render?: (value: any, item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
}

export default function DataTable<T>({ data, columns, className = '' }: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="border-b border-gray-700">
            {columns.map((col) => (
              <th key={col.key as string} className="text-left py-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-gray-800">
              {columns.map((col) => (
                <td key={col.key as string} className="py-2">
                  {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}