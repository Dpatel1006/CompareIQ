import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56 mt-2" />
      </div>

      <Skeleton className="h-[220px] rounded-xl" />
      <Skeleton className="h-[160px] rounded-xl" />
      <Skeleton className="h-[140px] rounded-xl" />
    </div>
  );
}
