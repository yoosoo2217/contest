import { ReactNode, ButtonHTMLAttributes } from "react";

export function Panel({
  children,
  className = "",
  border = "border-line",
}: {
  children: ReactNode;
  className?: string;
  border?: string;
}) {
  return (
    <div className={`border ${border} bg-panel/80 backdrop-blur-[1px] ${className}`}>
      {children}
    </div>
  );
}

export function TerminalButton({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "danger" | "ghost";
}) {
  const base =
    "px-5 py-3 text-sm tracking-widest uppercase border transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    default:
      "border-line text-ink hover:border-red-bright hover:text-red-bright bg-transparent",
    danger:
      "border-red text-red-bright hover:bg-red/20 bg-transparent",
    ghost:
      "border-transparent text-secondary hover:text-ink hover:border-line bg-transparent",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] tracking-[0.25em] uppercase text-muted">
      {children}
    </div>
  );
}

export function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`font-mono ${className}`}>{children}</div>;
}

export function SystemHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-line pb-4 mb-8">
      <div className="text-xs tracking-[0.3em] text-muted uppercase">
        보안 기록 시스템 // CL-902
      </div>
      <h1 className="mt-2 text-2xl md:text-3xl tracking-[0.15em] uppercase text-ink font-semibold">
        {title}
      </h1>
      {subtitle ? (
        <div className="mt-1 text-sm text-secondary tracking-widest uppercase">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

export function ClueTag({ label, dim = false }: { label: string; dim?: boolean }) {
  return (
    <span
      className={`inline-block border px-2 py-1 text-[11px] tracking-widest uppercase ${
        dim
          ? "border-line text-muted"
          : "border-red-bright/60 text-red-bright"
      }`}
    >
      {label}
    </span>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full flex justify-center px-4 py-10 md:py-16">
      <div className="w-full max-w-3xl">{children}</div>
    </main>
  );
}
