"use client";

import type { ReactNode } from "react";
import { signIn } from "next-auth/react";

import { buttonStyles } from "@/shared/components/koyun/button";

/** Microsoft Entra sign-in, styled as the primary action. Returns to `nextPath` afterwards. */
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
      className={buttonStyles("primary")}
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
