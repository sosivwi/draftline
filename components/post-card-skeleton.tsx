export function PostCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-none bg-transparent animate-pulse select-none"
    >
      {/* Aspect 16/10 sharp image placeholder */}
      <div className="relative w-full aspect-[16/10] rounded-none bg-neutral-200/80 dark:bg-neutral-900" />

      {/* Title pulse line */}
      <div className="mt-3.5 space-y-1.5">
        <div className="h-4 w-5/6 rounded-none bg-neutral-200/80 dark:bg-neutral-900" />
        <div className="h-4 w-3/5 rounded-none bg-neutral-200/80 dark:bg-neutral-900" />
      </div>

      {/* 1-line excerpt pulse */}
      <div className="mt-2 h-3.5 w-4/5 rounded-none bg-neutral-200/60 dark:bg-neutral-900/60" />

      {/* Metadata tag & author pulse */}
      <div className="mt-3 flex items-center gap-2.5">
        <div className="h-4 w-20 rounded-none bg-neutral-200/80 dark:bg-neutral-900" />
        <div className="h-3 w-28 rounded-none bg-neutral-200/60 dark:bg-neutral-900/60" />
      </div>
    </div>
  );
}
