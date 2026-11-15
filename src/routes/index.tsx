import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MapPin, ShieldCheck } from "lucide-react";
import { AppShell, card } from "@/components/app/AppShell";
import { Manner } from "@/components/app/Manner";
import { useStore } from "@/lib/store";
import { CATEGORY_LABEL, type Category, unitPrice, remainingUnits, totalUnits, won } from "@/lib/share-logic";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "내 주변 쉐어 · 자취메이트" }, { name: "description", content: "반경 500m 안에서 진행 중인 식재료·생필품·배달비 쉐어를 찾아보세요." }, { property: "og:title", content: "내 주변 쉐어 · 자취메이트" }, { property: "og:description", content: "반경 500m 안에서 진행 중인 식재료·생필품·배달비 쉐어를 찾아보세요." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Home,
});

function Home() {
  const { shares, hosts, user } = useStore();
  const [cat, setCat] = useState<Category | "all">("all");
  const list = shares.filter((s) => cat === "all" || s.category === cat);
  return (
    <AppShell>
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:mb-6">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">단국대 죽전캠퍼스 · 반경 500m</p>
          <h1 className="text-xl font-bold lg:text-3xl">내 주변 쉐어</h1>
        </div>
        {user?.gps && <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"><ShieldCheck className="size-3.5" />위치 인증</span>}
      </div>
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:mb-6 lg:px-0">
        {(["all", "food", "living", "delivery"] as const).map((c) => (
          <button key={c} onClick={() => setCat(c)} className={"shrink-0 rounded-full px-4 py-2 text-sm font-medium " + (cat === c ? "bg-dark-point text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
            {c === "all" ? "전체" : CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
        {list.map((s) => {
          const h = hosts.find((x) => x.id === s.hostId);
          const left = remainingUnits(s);
          return (
            <li key={s.id}>
              <Link to="/share/$id" params={{ id: s.id }} className={card + " flex h-full flex-col transition hover:border-primary hover:shadow-app"}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-primary">{CATEGORY_LABEL[s.category]}</span>
                    <h2 className="font-bold">{s.title}</h2>
                  </div>
                  <span className="shrink-0 text-lg font-bold">{won(unitPrice(s.totalPrice, s.totalQty, s.unitQty))}</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{s.distanceM ? `${s.distanceM}m · 도보 ${s.walkMin}분` : "내가 등록"} · {s.pickupZone}</p>
                <div className="mt-auto flex items-center justify-between pt-3 text-sm">
                  <span className={left ? "font-semibold" : "text-muted-foreground"}>{left ? `남은 ${left}/${totalUnits(s)}자리` : "모집 마감"}</span>
                  <span className="flex items-center gap-2 text-muted-foreground">{h?.name}{h && <Manner v={h.manner} />}</span>
                </div>
              </Link>
            </li>
          );
        })}
        {!list.length && <p className="col-span-full py-10 text-center text-muted-foreground">아직 이 카테고리 쉐어가 없어요.</p>}
      </ul>
      <Link to="/create" aria-label="쉐어 등록" className="fixed bottom-20 right-[max(1rem,calc(50%-224px))] z-20 flex lg:hidden h-14 items-center gap-1 rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-app"><Plus className="size-5" />쉐어 등록</Link>
    </AppShell>
  );
}
