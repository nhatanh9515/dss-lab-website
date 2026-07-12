export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg border border-line p-3"
        >
          <div className="aspect-square animate-pulse rounded bg-surface" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
          <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-surface" />
        </div>
      ))}
    </div>
  )
}
