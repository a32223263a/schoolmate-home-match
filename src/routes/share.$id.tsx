import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, ShieldCheck, Package } from "lucide-react";
import { AppShell, btn, btnGhost, card } from "@/components/app/AppShell";
import { Manner } from "@/components/app/Manner";
import { useStore } from "@/lib/store";
import { CATEGORY_LABEL, unitPrice, depositFor, remainingUnits, totalUnits, won } from "@/lib/share-logic";

export const Route = createFileRoute("/share/$id")({
  head: () => ({ meta: [{ title: "쉐어 상세 · 자취메이트" }, { name: "description", content: "쉐어 정보와 주최자 매너온도를 확인하고 보증금 예치로 안전하게 참여하세요." }, { property: "og:title", content: "쉐어 상세 · 자취메이트" }, { property: "og:description", content: "쉐어 정보와 주최자 매너온도를 확인하고 보증금 예치로 안전하게 참여하세요." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { shares, hosts, joins, join, hydrated } = useStore();
  const nav = useNavigate();
  const [sheet, setSheet] = useState(false);
  const s = shares.find((x) => x.id === id);
  if (!s) return <AppShell title="쉐어 상세" back><p className="py-10 text-center text-muted-foreground">{hydrated ? "쉐어를 찾을 수 없어요." : "불러오는 중..."}</p></AppShell>;
  const h = hosts.find((x) => x.id === s.hostId);
  const price = unitPrice(s.totalPrice, s.totalQty, s.unitQty);
  const dep = depositFor(price);
  const mine = s.hostId === "me";
  const joined = joins.some((j) => j.shareId === s.id);
  const left = remainingUnits(s);
  return (
    <AppShell title="쉐어 상세" back>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
      <div className="min-w-0">
      <span className="text-sm font-semibold text-primary">{CATEGORY_LABEL[s.category]}</span>
      <h1 className="text-2xl font-bold lg:text-3xl">{s.title}</h1>
      <p className="mt-1 text-3xl font-bold">{won(price)} <span className="text-base font-normal text-muted-foreground">/ 1인 ({s.unitQty}개)</span></p>
      <div className={card + " mt-4 space-y-2 text-sm"}>
        <p className="flex gap-2"><Package className="size-4 text-primary" />총 {s.totalQty}개 · 남은 {left}/{totalUnits(s)}자리</p>
        <p className="flex gap-2"><MapPin className="size-4 text-primary" />{s.pickupZone}{s.distanceM ? ` · ${s.distanceM}m(도보 ${s.walkMin}분)` : ""}</p>
        <p className="flex gap-2"><Clock className="size-4 text-primary" />마감 {s.deadline}</p>
      </div>
      {s.description && <p className="mt-4 leading-relaxed">{s.description}</p>}
      </div>
      <aside className="lg:sticky lg:top-24">
      {h && <div className={card + " mt-4 lg:mt-0 flex items-center justify-between"}>
        <div><p className="text-xs text-muted-foreground">주최자</p><p className="font-semibold">{h.name}</p><p className="text-xs text-muted-foreground">거래 {h.trades}회</p></div>
        <Manner v={h.manner} /></div>}
      <div className={card + " mt-4 flex gap-3 bg-accent text-sm text-accent-foreground"}><ShieldCheck className="size-5 shrink-0" />
        <p>계좌번호 공개 없이 앱에서 결제해요. 보증금 {won(dep)}은 수령 완료 시 자동 반환되고, 대금은 주최자에게 자동 정산됩니다.</p></div>
      <div className="mt-6">
        {mine ? <p className="text-center text-muted-foreground">내가 등록한 쉐어예요.</p>
          : joined ? <Link to="/pickup/$id" params={{ id: s.id }} className={btn}>픽업 화면 보기</Link>
          : <button className={btn} disabled={!left} onClick={() => setSheet(true)}>{left ? "참여하기 (자동 정산)" : "모집 마감"}</button>}
      </div>
      </aside>
      </div>
      {sheet && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-dark-point/50 lg:items-center" onClick={() => setSheet(false)}>
          <div role="dialog" aria-label="보증금 예치" className="w-full max-w-[480px] rounded-t-3xl bg-background p-6 lg:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">보증금 예치</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>쉐어 대금</dt><dd>{won(price)}</dd></div>
              <div className="flex justify-between"><dt>노쇼 방지 보증금</dt><dd>{won(dep)}</dd></div>
              <div className="flex justify-between border-t pt-2 text-base font-bold"><dt>결제 금액</dt><dd>{won(price + dep)}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-muted-foreground">테스트용 모의 결제예요. 실제 돈은 빠져나가지 않아요.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className={btnGhost} onClick={() => setSheet(false)}>취소</button>
              <button className={btn} onClick={() => { join(s.id, price, dep); nav({ to: "/pickup/$id", params: { id: s.id } }); }}>예치하기</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
