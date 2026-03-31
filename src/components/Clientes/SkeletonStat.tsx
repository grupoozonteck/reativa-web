export function SkeletonStat() {
    return (
        <div className="arena-card p-4 sm:p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-surface-container animate-pulse shrink-0" />
            <div className="space-y-2">
                <div className="h-3 w-24 rounded-md bg-surface-container animate-pulse" />
                <div className="h-6 w-14 rounded-md bg-surface-container animate-pulse" />
            </div>
        </div>
    );
}
