import React from 'react'

interface ErrorMessageProps {
  message: string
  className?: string
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`text-red-500 text-center p-8 ${className}`}>
      Error: {message}
    </div>
  )
}