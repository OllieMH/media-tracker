// Skeleton placeholder for a saved MediaCard (cover image card)
export function MediaCardSkeleton() {
  return (
    <div className="aspect-[2/3] animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
  );
}

// Skeleton placeholder for a search result card (vertical layout)
export function SearchResultSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Cover image area */}
      <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="p-3 flex flex-col gap-2">
        {/* Title */}
        <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
        {/* Subtitle */}
        <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
        {/* Button */}
        <div className="mt-1 h-7 w-full rounded-md bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
