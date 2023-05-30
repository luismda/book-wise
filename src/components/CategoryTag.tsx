import { ReactNode } from 'react'

interface CategoryTagProps {
  children: ReactNode
  isChecked: boolean
  onCheckedChange: (isChecked: boolean) => void
}

export function CategoryTag({
  children,
  isChecked,
  onCheckedChange,
}: CategoryTagProps) {
  function handleCheckedChange() {
    onCheckedChange(!!isChecked)
  }

  return (
    <button
      className="rounded-full border border-purple-100 bg-transparent px-4 py-1 text-purple-100 outline-none transition-colors hover:bg-purple-200 hover:text-gray-100 focus:bg-purple-200 focus:text-gray-100 aria-[checked=true]:border-transparent aria-[checked=true]:bg-purple-200 aria-[checked=true]:text-gray-100"
      role="checkbox"
      aria-checked={isChecked}
      onClick={handleCheckedChange}
    >
      {children}
    </button>
  )
}
