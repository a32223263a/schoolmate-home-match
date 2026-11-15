import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AppShell, btnGhost, card } from "@/components/app/AppShell";
import { Manner } from "@/components/app/Manner";
import { useStore } from "@/lib/store";
import { STATUS_LABEL, won, remainingUnits } from "@/lib/share-logic";

export const Route = createFileRoute("/my")({
  head: () => ({ meta: [{ title: "마이페이지 · 자취메이트" }, { name: "description", content: "내 매너온도, 참여 중인 쉐어의 정산 상태와 픽업 안내를 확인하세요." }, { property: "og:title", content: "마이페이지 · 자취메이트" }, { property: "og:description", content: "내 매너온도, 참여 중인 쉐어의 정산 상태와 픽업 안내를 확인하세요." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: My,
});
function My() {
  const { user, hosts, joins, shares, logout, reset } = useStore();
  const nav = useNavigate();
  const me = hosts.find((h) => h.id === "me");
  const mine = shares.filter((s) => s.hostId === "me");
  return (
    <AppShell title="마이페이지">
      <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="lg:sticky lg:top-24">
      <div className={card + " flex items-center justify-between gap-3"}>
        <div className="min-w-0"><p className="truncate text-lg font-bold">{user?.name}</p><p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground"><ShieldCheck className="size-3.5" />단국대 · 500m 인증</span></div>
        <Manner v={me?.manner ?? 36.5} />
      </div>
      <div className="mt-4 hidden grid-cols-2 gap-2 lg:grid">
        <button className={btnGhost} onClick={() => { reset(); nav({ to: "/login" }); }}>샘플 초기화</button>
        <button className={btnGhost} onClick={() => { logout(); nav({ to: "/login" }); }}>로그아웃</button>
      </div>
      </div>
      <div className="min-w-0">
      <h2 className="mb-2 mt-6 font-bold lg:mt-0">참여 중인 쉐어</h2>
      <ul className="grid gap-2 xl:grid-cols-2">{joins.map((j) => { const s = shares.find((x) => x.id === j.shareId); if (!s) return null; return (
        <li key={j.shareId}><Link to="/pickup/$id" params={{ id: s.id }} className={card + " flex items-center justify-between"}>
          <div><p className="font-semibold">{s.title}</p><p className="text-sm text-muted-foreground">{won(j.price)} · {s.pickupZone}</p></div>
          <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + (j.status === "done" ? "bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground")}>{STATUS_LABEL[j.status]}</span>
        </Link></li>); })}</ul>
      {!joins.length && <p className="text-sm text-muted-foreground">아직 참여한 쉐어가 없어요. <Link to="/" className="font-semibold text-primary">둘러보기</Link></p>}
      <h2 className="mb-2 mt-6 font-bold">내가 등록한 쉐어</h2>
      <ul className="grid gap-2 xl:grid-cols-2">{mine.map((s) => <li key={s.id}><Link to="/share/$id" params={{ id: s.id }} className={card + " flex justify-between"}><span className="font-semibold">{s.title}</span><span className="text-sm text-muted-foreground">남은 {remainingUnits(s)}자리</span></Link></li>)}</ul>
      {!mine.length && <p className="text-sm text-muted-foreground">등록한 쉐어가 없어요.</p>}
      <div className="mt-8 grid grid-cols-2 gap-2 lg:hidden">
        <button className={btnGhost} onClick={() => { reset(); nav({ to: "/login" }); }}>샘플 데이터 초기화</button>
        <button className={btnGhost} onClick={() => { logout(); nav({ to: "/login" }); }}>로그아웃</button>
      </div>
      </div>
      </div>
    </AppShell>
  );
}
