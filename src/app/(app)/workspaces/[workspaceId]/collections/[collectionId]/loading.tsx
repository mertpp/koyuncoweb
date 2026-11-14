import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function CollectionDetailLoading() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 py-4 pb-24 md:py-8 md:pb-8">
      <div className="rounded-[2rem] border bg-card px-6 py-7 shadow-sm md:px-8 md:py-9">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-5 h-14 w-full max-w-2xl" />
        <Skeleton className="mt-4 h-5 w-full max-w-3xl" />
        <Skeleton className="mt-8 h-24 w-full rounded-2xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
