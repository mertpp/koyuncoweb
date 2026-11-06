"use client";

import { signIn } from "next-auth/react";

import { cn } from "cn";

import { ONBOARDING_CONTINUE_PATH } from "@/shared/auth/constants";

type LandingAuthButtonProps = React.ComponentProps<"button"> & {
  nextPath: string;
};

export function LandingAuthButton({
  nextPath: _nextPath,
  className,
  children = "Sign-in",
  ...props
}: LandingAuthButtonProps) {
  void _nextPath;

  return (
    <button
      type="button"
      onClick={() => {
        void signIn(
          "azure-ad",
          { callbackUrl: ONBOARDING_CONTINUE_PATH },
          { prompt: "select_account" },
        );
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full bg-primary-container px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]",
        className,
      )}
      {...props}
    >
      <MicrosoftIcon className="size-4" />
      <span>{children}</span>
    </button>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 0h10v10H0V0Zm11 0h10v10H11V0ZM0 11h10v10H0V11Zm11 0h10v10H11V11Z"
      />
    </svg>
  );
}
