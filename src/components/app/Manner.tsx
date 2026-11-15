export function Manner({ v }: { v: number }) {
  return <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">🌡 {v.toFixed(1)}℃</span>;
}
