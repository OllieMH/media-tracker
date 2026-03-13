// Skeleton placeholder for a saved MediaCard (horizontal layout)
export function MediaCardSkeleton() {
  return (
    <div className="flex animate-pulse gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Cover image placeholder */}
      <div className="h-[90px] w-[60px] flex-shrink-0 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="flex flex-1 flex-col gap-2">
        {/* Title */}
        <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
        {/* Status dropdown */}
        <div className="h-6 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
        {/* Rating stars */}
        <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
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
