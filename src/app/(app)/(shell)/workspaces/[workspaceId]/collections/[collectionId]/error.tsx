"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

export default function CollectionDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-8 pb-24 md:pb-8">
      <Card className="border-destructive/20 bg-card py-12 text-center">
        <CardContent className="mx-auto max-w-xl space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Collection could not load
          </p>
          <h1 className="font-heading text-3xl tracking-[-0.03em]">
            Something interrupted this aesthetic territory.
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {error.message || "Please retry the request."}
          </p>
          <Button onClick={reset}>Retry</Button>
        </CardContent>
      </Card>
    </section>
  );
}
