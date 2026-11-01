import { cn } from "cn"; // O la ruta de tu utilidad cn
import * as React from "react";

function KoyunCard({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="koyun-card"
      data-size={size}
      className={cn("koyun-card", className)}
      {...props}
    />
  );
}

function KoyunCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="koyun-card-header"
      className={cn("koyun-card-header", className)}
      {...props}
    />
  );
}

function KoyunCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="koyun-card-title"
      className={cn("koyun-card-title", className)}
      {...props}
    />
  );
}

function KoyunCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="koyun-card-description"
      className={cn("koyun-card-description", className)}
      {...props}
    />
  );
}

function KoyunCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="koyun-card-action"
      className={cn("koyun-card-action", className)}
      {...props}
    />
  );
}

function KoyunCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="koyun-card-content"
      className={cn("koyun-card-content", className)}
      {...props}
    />
  );
}

function KoyunCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="koyun-card-footer"
      className={cn("koyun-card-footer", className)}
      {...props}
    />
  );
}

function KoyunPhotoCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="koyun-photo-card"
      className={cn("koyun-photo-card", className)}
      {...props}
    />
  );
}

export {
  KoyunCard,
  KoyunCardAction,
  KoyunCardContent,
  KoyunCardDescription,
  KoyunCardFooter,
  KoyunCardHeader,
  KoyunCardTitle,
  KoyunPhotoCard,
};
