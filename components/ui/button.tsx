import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "!bg-slate-950 !text-white shadow-sm hover:!bg-slate-900 hover:!text-white",
  secondary:
    "!border !border-slate-200 !bg-white !text-slate-950 shadow-sm hover:!bg-slate-100 hover:!text-slate-950",
  ghost:
    "!bg-transparent !text-slate-800 hover:!bg-slate-100 hover:!text-slate-950",
  danger:
    "!bg-red-600 !text-white shadow-sm hover:!bg-red-700 hover:!text-white",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold no-underline transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: Variant;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, className, variants[variant])}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(base, className, variants[variant])}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}