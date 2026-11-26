"use client";

import { Container, Page } from "@/shared/components/koyun/layout";
import { UnreachableState } from "@/shared/components/koyun/unreachable";

import "./globals.css";

// Last safety net: the root layout itself failed, so this replaces it and must render
// <html> and <body>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <Page>
          <Container>
            <UnreachableState reset={reset} />
          </Container>
        </Page>
      </body>
    </html>
  );
}
