"use client";

import { Container } from "@/shared/components/koyun/layout";
import { UnreachableState } from "@/shared/components/koyun/unreachable";

// A page inside the app shell failed: the menu stays, only the content is replaced.
export default function ShellError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container>
      <UnreachableState reset={reset} />
    </Container>
  );
}
