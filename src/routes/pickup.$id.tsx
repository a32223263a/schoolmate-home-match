import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Check, Star } from "lucide-react";
import { AppShell, btn, card } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { STATUS_LABEL, type JoinStatus, won } from "@/lib/share-logic";

export const Route = createFileRoute("/pickup/$id")({
  head: () => ({ meta: [{ title: "비대면 픽업 · 자취메이트" }, { name: "description", content: "픽업존 위치와 QR 수령증으로 비대면 수령하고 매너 평가를 남기세요." }, { property: "og:title", content: "비대면 픽업 · 자취메이트" }, { property: "og:description", content: "픽업존 위치와 QR 수령증으로 비대면 수령하고 매너 평가를 남기세요." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Pickup,
});
const TAGS = ["시간 약속을 잘 지켜요", "소분이 깔끔해요", "응답이 빨라요", "친절해요"];
const STEPS: JoinStatus[] = ["deposited", "pickup", "done"];

function Pickup() {
  const { id } = Route.useParams();
  const { shares, joins, hosts, advance, rate, hydrated } = useStore();
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const s = shares.find((x) => x.id === id);
  const j = joins.find((x) => x.shareId === id);
  if (!s || !j) return <AppShell title="픽업" back width="narrow"><p className="py-10 text-center text-muted-foreground">{hydrated ? "참여한 쉐어가 아니에요." : "불러오는 중..."}</p></AppShell>;
  const h = hosts.find((x) => x.id === s.hostId);
  const idx = STEPS.indexOf(j.status);
  return (
    <AppShell title="안심 픽업" back width="narrow">
      <h1 className="text-xl font-bold">{s.title}</h1>
      <ol className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        {STEPS.map((st, i) => <li key={st} className={"rounded-xl py-2 font-semibold " + (i <= idx ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>{STATUS_LABEL[st]}</li>)}
      </ol>
      <div className={card + " mt-4 flex gap-3"}><MapPin className="size-5 shrink-0 text-primary" /><div><p className="font-semibold">{s.pickupZone}</p><p className="text-sm text-muted-foreground">주최자가 보관함에 넣으면 알림을 보내드려요.</p></div></div>

      {j.status === "deposited" && <div className="mt-6 space-y-3 text-center">
        <p className="text-muted-foreground">보증금 {won(j.deposit)} 포함 {won(j.price + j.deposit)} 예치 완료 · 주최자 입고 대기 중</p>
        <button className={btn} onClick={() => advance(s.id)}>주최자 입고 완료 (테스트)</button>
      </div>}

      {j.status === "pickup" && <div className="mt-6 space-y-4 text-center">
        <div className={card + " inline-block"}><QRCodeSVG value={`jachimate:${j.code}:${s.id}`} size={200} /></div>
        <p className="font-mono text-lg font-bold tracking-widest">{j.code}</p>
        <p className="text-sm text-muted-foreground">보관함 리더기에 QR을 보여주세요.</p>
        <button className={btn} onClick={() => advance(s.id)}><Check className="mr-2 size-5" />수령 완료</button>
      </div>}

      {j.status === "done" && <div className="mt-6 space-y-4">
        <div className={card + " bg-accent text-center text-accent-foreground"}><p className="font-bold">정산 완료!</p><p className="text-sm">{won(j.price)} 주최자 정산 · 보증금 {won(j.deposit)} 반환</p></div>
        {j.rated ? <div className="space-y-3 text-center"><p>평가 감사해요! {h?.name}님 매너온도 {h?.manner.toFixed(1)}℃</p><Link to="/" className={btn}>홈으로</Link></div> : <>
          <h2 className="font-bold">{h?.name}님과의 거래는 어땠나요?</h2>
          <div className="flex justify-center gap-1">{[1, 2, 3, 4, 5].map((n) => (
            <button key={n} aria-label={`별점 ${n}점`} onClick={() => setStars(n)}><Star className={"size-9 " + (n <= stars ? "fill-primary text-primary" : "text-border")} /></button>))}</div>
          <div className="flex flex-wrap gap-2">{TAGS.map((t) => (
            <button key={t} onClick={() => setTags((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])} className={"rounded-full px-3 py-1.5 text-sm " + (tags.includes(t) ? "bg-primary text-primary-foreground" : "bg-secondary")}>{t}</button>))}</div>
          <button className={btn} onClick={() => rate(s.id, stars, tags)}>평가 보내기</button>
        </>}
      </div>}
    </AppShell>
  );
}
