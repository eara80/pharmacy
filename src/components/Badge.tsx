interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple' | 'orange'
  size?: 'sm' | 'md'
}

const COLORS = {
  green:  'bg-green-100 text-green-800 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red:    'bg-red-100 text-red-800 border-red-200',
  blue:   'bg-blue-100 text-blue-800 border-blue-200',
  gray:   'bg-gray-100 text-gray-700 border-gray-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
}

export default function Badge({ children, variant = 'gray', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center border font-medium rounded-full
        ${COLORS[variant]}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
    >
      {children}
    </span>
  )
}
