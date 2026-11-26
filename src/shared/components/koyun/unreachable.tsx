"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

import { Button, buttonStyles } from "./button";
import { ErrorState } from "./error-state";

// The one friendly screen for any unexpected failure (D16), most often the backend being
// down. Validation errors and 404s keep their own handling. "Try again" asks the server for
// the page again and then clears the error.

export function UnreachableState({ reset }: { reset: () => void }) {
  const router = useRouter();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <ErrorState
      title="We can't reach Koyun right now"
      description="It's on our side, not yours. Please try again in a moment."
      actions={
        <>
          <Button onClick={retry}>Try again</Button>
          <Link href="/" className={buttonStyles("secondary")}>
            Go to home
          </Link>
        </>
      }
    />
  );
}
