"use client";

import type { ReactNode } from "react";
import { signIn } from "next-auth/react";

// Temporary copy of LandingAuthButton for the /landing-tokens comparison, styled as the
// DESIGN.md primary action (8px radius, not a pill). Removed once a landing is chosen.
export function SignInButton({
  nextPath,
  children = "Sign-in",
}: {
  nextPath: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        void signIn("azure-ad", { callbackUrl: nextPath }, { prompt: "select_account" });
      }}
      className="inline-flex items-center justify-center gap-space-sm rounded-lg bg-primary px-5 py-2.5 text-label-md text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <MicrosoftIcon />
      <span>{children}</span>
    </button>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="size-4" viewBox="0 0 21 21" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 0h10v10H0V0Zm11 0h10v10H11V0ZM0 11h10v10H0V11Zm11 0h10v10H11V11Z"
      />
    </svg>
  );
}
