import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Home, PlusCircle, Bell, User, ChevronLeft, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/", label: "홈", Icon: Home },
  { to: "/create", label: "쉐어 등록", Icon: PlusCircle },
  { to: "/notifications", label: "알림", Icon: Bell },
  { to: "/my", label: "마이", Icon: User },
] as const;

/**
 * Responsive shell: below lg it is a phone column (max 480px) with a bottom nav;
 * from lg up it becomes a desktop layout with a left sidebar and a wide content area.
 * `width` controls the desktop content width: "narrow" for forms/flows, "wide" for feeds.
 */
export function AppShell({ title, back, children, requireAuth = true, width = "wide" }: { title?: string; back?: boolean; children: ReactNode; requireAuth?: boolean; width?: "narrow" | "wide" }) {
  const { user, hydrated, notis } = useStore();
  const nav = useNavigate();
  useEffect(() => { if (requireAuth && hydrated && !user) nav({ to: "/login" }); }, [requireAuth, hydrated, user, nav]);
  const inner = width === "narrow" ? "lg:max-w-2xl" : "lg:max-w-6xl";
  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto flex min-h-screen max-w-[480px] bg-background shadow-app lg:max-w-none lg:shadow-none">
        {requireAuth && (
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-background px-4 py-6 lg:flex">
            <Link to="/" className="px-3 text-xl font-bold text-primary">자취메이트</Link>
            <p className="px-3 text-xs text-muted-foreground">단국대 죽전 · 반경 500m 쉐어</p>
            <Link to="/create" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground"><PlusCircle className="size-5" />쉐어 등록</Link>
            <nav className="mt-6 flex flex-col gap-1">
              {NAV.map(({ to, label, Icon }) => (
                <Link key={to} to={to} activeOptions={{ exact: true }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary data-[status=active]:bg-accent data-[status=active]:font-semibold data-[status=active]:text-accent-foreground">
                  <Icon className="size-5" />{label}
                  {to === "/notifications" && notis.length > 0 && <span className="ml-auto rounded-full bg-primary px-2 text-xs text-primary-foreground">{notis.length}</span>}
                </Link>
              ))}
            </nav>
            {user && (
              <div className="mt-auto rounded-2xl bg-secondary p-3">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                {user.gps && <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"><ShieldCheck className="size-3.5" />위치 인증</span>}
              </div>
            )}
          </aside>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {title && (
            <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
              <div className={"mx-auto flex h-14 w-full items-center gap-2 px-4 lg:h-16 lg:px-8 " + inner}>
                {back && <button aria-label="뒤로" onClick={() => history.back()} className="-ml-2 p-2"><ChevronLeft className="size-5" /></button>}
                <h1 className="truncate text-lg font-bold lg:text-xl">{title}</h1>
              </div>
            </header>
          )}
          <main className={"mx-auto w-full flex-1 px-4 pb-28 pt-4 lg:px-8 lg:pb-12 lg:pt-8 " + inner}>{children}</main>
        </div>
        {requireAuth && (
          <nav className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-[480px] -translate-x-1/2 grid-cols-4 border-t bg-background lg:hidden">
            {NAV.map(({ to, label, Icon }) => (
              <Link key={to} to={to} activeOptions={{ exact: true }} className="relative flex flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground data-[status=active]:font-semibold data-[status=active]:text-primary">
                <Icon className="size-5" />{label}
                {to === "/notifications" && notis.length > 0 && <span className="absolute right-[30%] top-2 size-2 rounded-full bg-primary" />}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
export const btn = "inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition active:scale-[.98] disabled:opacity-40";
export const btnGhost = "inline-flex h-12 w-full items-center justify-center rounded-xl bg-secondary font-semibold text-secondary-foreground";
export const input = "h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary";
export const card = "rounded-2xl border bg-card p-4";
