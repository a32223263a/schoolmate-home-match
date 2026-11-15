import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, btn, input } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { CATEGORY_LABEL, PICKUP_ZONES, type Category, unitPrice, won } from "@/lib/share-logic";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "쉐어 등록 · 자취메이트" }, { name: "description", content: "대용량 식재료·생필품이나 배달비를 이웃 자취생과 나눠보세요." }, { property: "og:title", content: "쉐어 등록 · 자취메이트" }, { property: "og:description", content: "대용량 식재료·생필품이나 배달비를 이웃 자취생과 나눠보세요." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Create,
});

function Create() {
  const { addShare } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ title: "", category: "food" as Category, totalQty: 2, unitQty: 1, totalPrice: 0, pickupZone: PICKUP_ZONES[0] as string, deadline: "오늘 21:00", description: "" });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const ok = f.title.trim() && f.totalPrice > 0 && f.unitQty > 0 && f.totalQty >= f.unitQty * 2;
  const L = "mb-1 block text-sm font-semibold";
  return (
    <AppShell title="쉐어 등록" back width="narrow">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!ok) return; const id = addShare(f); nav({ to: "/share/$id", params: { id } }); }}>
        <div><label className={L} htmlFor="t">품목명</label><input id="t" className={input} placeholder="예: 우유 1L 반반 쉐어" value={f.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div><span className={L}>카테고리</span><div className="flex gap-2">{(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
          <button type="button" key={c} onClick={() => set("category", c)} className={"flex-1 rounded-xl py-3 text-sm font-medium " + (f.category === c ? "bg-primary text-primary-foreground" : "bg-secondary")}>{CATEGORY_LABEL[c]}</button>))}</div></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={L} htmlFor="tq">총 수량</label><input id="tq" type="number" min={1} className={input} value={f.totalQty} onChange={(e) => set("totalQty", +e.target.value)} /></div>
          <div><label className={L} htmlFor="uq">소분 수량(1인)</label><input id="uq" type="number" min={1} className={input} value={f.unitQty} onChange={(e) => set("unitQty", +e.target.value)} /></div>
        </div>
        <div><label className={L} htmlFor="p">총 가격(원)</label><input id="p" type="number" min={0} className={input} value={f.totalPrice || ""} onChange={(e) => set("totalPrice", +e.target.value)} />
          {f.totalPrice > 0 && f.unitQty > 0 && <p className="mt-1 text-sm text-primary">1인당 {won(unitPrice(f.totalPrice, f.totalQty, f.unitQty))}</p>}</div>
        <div><label className={L} htmlFor="z">픽업 위치</label><select id="z" className={input} value={f.pickupZone} onChange={(e) => set("pickupZone", e.target.value)}>{PICKUP_ZONES.map((z) => <option key={z}>{z}</option>)}</select></div>
        <div><label className={L} htmlFor="d">마감</label><input id="d" className={input} value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></div>
        <div><label className={L} htmlFor="m">설명</label><textarea id="m" rows={3} className={input + " h-auto py-3"} value={f.description} onChange={(e) => set("description", e.target.value)} /></div>
        {f.totalQty < f.unitQty * 2 && <p className="text-sm text-destructive">최소 2명이 나눌 수 있는 수량이어야 해요.</p>}
        <button className={btn} disabled={!ok}>등록하기</button>
      </form>
    </AppShell>
  );
}
