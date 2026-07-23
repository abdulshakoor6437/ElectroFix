import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeVariant =
  | "pending"
  | "approved"
  | "cancelled"
  | "completed"
  | "open"
  | "resolved"
  | "default";

const variantStyles: Record<BadgeVariant, string> = {
  pending:   "bg-yellow-100 text-yellow-800 border border-yellow-200",
  approved:  "bg-blue-100  text-blue-800  border border-blue-200",
  cancelled: "bg-red-100   text-red-800   border border-red-200",
  completed: "bg-green-100 text-green-800 border border-green-200",
  open:      "bg-orange-100 text-orange-800 border border-orange-200",
  resolved:  "bg-gray-100  text-gray-700  border border-gray-200",
  default:   "bg-gray-100  text-gray-700  border border-gray-200",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  const isStatus = ["pending", "approved", "cancelled", "completed", "open", "resolved"].includes(variant);

  if (isStatus) {
    let positionClass = "translate-x-0"; // DOWN/OFF (default for pending/cancelled/open)
    let colorClass = "bg-[#F5B400]"; // pending (safety amber)
    let label = children || variant.toUpperCase();

    if (variant === "approved" || variant === "resolved") {
      positionClass = "translate-x-4"; // UP/ON
      colorClass = "bg-[#2F8F5B]"; // approved (muted green)
    } else if (variant === "cancelled" || variant === "open") {
      positionClass = "translate-x-0"; // DOWN/OFF
      colorClass = "bg-[#D8532E]"; // cancelled (muted coral)
    } else if (variant === "completed") {
      positionClass = "translate-x-4"; // UP/ON
      colorClass = "bg-white border border-navy/20 shadow-sm"; // completed (white dial in Navy container)
    }

    return (
      <span className={cn("inline-flex items-center gap-2 select-none", className)} {...props}>
        {/* Switch Graphic */}
        <span className="w-9 h-5 bg-[#0B1B2E] border border-gray-700 rounded p-0.5 inline-flex items-center relative shadow-inner shrink-0">
          <span className={cn("w-3.5 h-3.5 rounded-sm transition-all duration-150", colorClass, positionClass)} />
        </span>
        {/* Labeled status */}
        <span className="font-mono text-xs uppercase tracking-wider text-current font-bold">
          {label}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ── Star Rating display ────────────────────────────────────────
interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

const sizeMap = { sm: "text-sm", md: "text-base", lg: "text-xl" };

export function StarRating({
  rating,
  size = "md",
  showNumber = false,
}: StarRatingProps) {
  return (
    <span className={cn("flex items-center gap-1", sizeMap[size])}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-[#ffd700]" : "text-gray-300"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      {showNumber && (
        <span className="text-xs text-gray-500 ml-1 font-medium">
          ({rating}/5)
        </span>
      )}
    </span>
  );
}
