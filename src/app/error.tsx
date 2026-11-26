"use client";

import { Container, Page } from "@/shared/components/koyun/layout";
import { UnreachableState } from "@/shared/components/koyun/unreachable";

// Any other page failed (onboarding, sign-in, pages outside the shell).
export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Page>
      <Container>
        <UnreachableState reset={reset} />
      </Container>
    </Page>
  );
}
