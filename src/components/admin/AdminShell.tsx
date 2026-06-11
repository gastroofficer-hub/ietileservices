import type { ReactNode } from "react";

export function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-border p-6 lg:p-8">
      <h2 className="font-display text-2xl">{title}</h2>
      {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
      {children}
    </span>
  );
}

export const inputCls =
  "w-full bg-transparent border border-border focus:border-gold outline-none px-3 py-2 text-sm";
export const textareaCls =
  "w-full bg-transparent border border-border focus:border-gold outline-none px-3 py-2 text-sm min-h-[88px]";
