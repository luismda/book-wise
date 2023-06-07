export function Loader() {
  return (
    <div aria-label="Carregando" className="flex items-center gap-2">
      <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500" />
      <span className="h-3 w-3 animate-bounce-delay rounded-full bg-gray-500" />
      <span className="h-3 w-3 animate-bounce-super-delay rounded-full bg-gray-500" />
    </div>
  )
}
