import { createFileRoute } from "@tanstack/react-router";
import { AppShell, card } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "알림 · 자취메이트" }, { name: "description", content: "참여, 예치, 입고, 수령 등 내 쉐어의 상태 변화를 확인하세요." }, { property: "og:title", content: "알림 · 자취메이트" }, { property: "og:description", content: "참여, 예치, 입고, 수령 등 내 쉐어의 상태 변화를 확인하세요." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Notis,
});
function Notis() {
  const { notis } = useStore();
  return (
    <AppShell title="알림" width="narrow">
      <ul className="space-y-2">{notis.map((n) => <li key={n.id} className={card + " text-sm"}><p>{n.text}</p><p className="mt-1 text-xs text-muted-foreground">{n.at}</p></li>)}</ul>
      {!notis.length && <p className="py-10 text-center text-muted-foreground">새 알림이 없어요.</p>}
    </AppShell>
  );
}
