import * as Checkbox from '@radix-ui/react-checkbox'

interface CategoryTagProps extends Checkbox.CheckboxProps {}

export function CategoryTag(props: CategoryTagProps) {
  return (
    <Checkbox.Root
      className="rounded-full border border-purple-100 bg-transparent px-4 py-1 text-purple-100 outline-none transition-colors hover:bg-purple-200 hover:text-gray-100 focus:bg-purple-200 focus:text-gray-100 aria-[checked=true]:border-transparent aria-[checked=true]:bg-purple-200 aria-[checked=true]:text-gray-100"
      {...props}
    />
  )
}
