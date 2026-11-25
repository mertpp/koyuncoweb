import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge resolves conflicting classes (the last one wins: cn("p-2", "p-4") -> "p-4").
// It only knows Tailwind's built-in names, so our tokens from globals.css are registered here.
// Without this, "text-headline-xl" would be taken for a colour and would remove
// "text-muted-foreground". When a token is added to globals.css, add it here too.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        "space-xs",
        "space-sm",
        "space-md",
        "space-lg",
        "space-xl",
        "gutter",
        "gutter-mobile",
        "margin",
        "margin-mobile",
        "margin-tablet",
      ],
      container: ["page"],
      shadow: ["elevated"],
    },
    classGroups: {
      "font-size": [
        {
          text: [
            "headline-2xl",
            "headline-xl",
            "headline-lg",
            "headline-md",
            "headline-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "label-md",
            "label-sm",
            "tech-md",
            "tech-sm",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
