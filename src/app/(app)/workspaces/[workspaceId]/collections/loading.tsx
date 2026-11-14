import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      <div className="rounded-[2rem] border bg-card px-6 py-7 shadow-sm md:px-8 md:py-9">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="mt-5 h-14 w-full max-w-xl" />
        <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="min-h-72">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-28 w-full rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
