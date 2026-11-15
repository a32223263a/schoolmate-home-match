import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Share, type Host, type JoinStatus, nextStatus, applyRating } from "./share-logic";

export interface Join { shareId: string; status: JoinStatus; price: number; deposit: number; code: string; rated?: boolean }
export interface Noti { id: string; text: string; at: string }
export interface User { email: string; name: string; gps: boolean; manner: number }
interface State { user: User | null; shares: Share[]; hosts: Host[]; joins: Join[]; notis: Noti[] }

const seed = (): State => ({
  user: null,
  hosts: [
    { id: "h1", name: "죽전동 우유러버", manner: 38.2, trades: 14 },
    { id: "h2", name: "정문 자취 3년차", manner: 41.5, trades: 32 },
    { id: "h3", name: "새내기 지훈", manner: 36.5, trades: 2 },
    { id: "h4", name: "치킨은 반반", manner: 39.8, trades: 21 },
  ],
  shares: [
    { id: "s1", title: "우유 1L 반반 쉐어", category: "food", totalQty: 2, unitQty: 1, totalPrice: 3600, pickupZone: "정문 GS편의점 택배함", distanceM: 220, walkMin: 3, hostId: "h1", joinedUnits: 1, deadline: "오늘 21:00", description: "2+1 행사로 산 우유 반 나눠요. 유통기한 넉넉합니다." },
    { id: "s2", title: "계란 10구 소분", category: "food", totalQty: 10, unitQty: 5, totalPrice: 5000, pickupZone: "정문 GS편의점 택배함", distanceM: 150, walkMin: 2, hostId: "h2", joinedUnits: 1, deadline: "오늘 22:00", description: "정문 GS앞 보관함에 5구씩 소분해서 넣어둘게요." },
    { id: "s3", title: "휴지 30롤 소분", category: "living", totalQty: 30, unitQty: 10, totalPrice: 18000, pickupZone: "기숙사 1층 무인 보관함", distanceM: 410, walkMin: 6, hostId: "h3", joinedUnits: 1, deadline: "내일 18:00", description: "대용량이라 10롤씩 3명 나눠요." },
    { id: "s4", title: "교촌치킨 배달비 쉐어", category: "delivery", totalQty: 3, unitQty: 1, totalPrice: 4500, pickupZone: "후문 CU 무인 보관함", distanceM: 300, walkMin: 4, hostId: "h4", joinedUnits: 1, deadline: "오늘 19:30", description: "배달비 4,500원 3명이서 나눠요. 각자 메뉴 주문." },
    { id: "s5", title: "양파 1망(3kg) 나눔", category: "food", totalQty: 3, unitQty: 1, totalPrice: 6000, pickupZone: "후문 CU 무인 보관함", distanceM: 480, walkMin: 7, hostId: "h2", joinedUnits: 0, deadline: "내일 12:00", description: "1kg씩 봉지에 담아 둡니다." },
    { id: "s6", title: "주방세제 리필 2L", category: "living", totalQty: 2, unitQty: 1, totalPrice: 7800, pickupZone: "기숙사 1층 무인 보관함", distanceM: 350, walkMin: 5, hostId: "h1", joinedUnits: 0, deadline: "모레 20:00", description: "공병 가져오시면 1L씩 덜어드려요(보관함 수령도 가능)." },
    { id: "s7", title: "엽떡 배달비 반반", category: "delivery", totalQty: 2, unitQty: 1, totalPrice: 3000, pickupZone: "정문 GS편의점 택배함", distanceM: 260, walkMin: 4, hostId: "h4", joinedUnits: 0, deadline: "오늘 20:00", description: "엽떡 시킬 분! 배달비만 반반." },
  ],
  joins: [], notis: [],
});

const KEY = "jachimate-v1";
interface Ctx extends State {
  hydrated: boolean;
  login(u: User): void; logout(): void;
  addShare(s: Omit<Share, "id" | "hostId" | "joinedUnits" | "distanceM" | "walkMin">): string;
  join(shareId: string, price: number, deposit: number): void;
  advance(shareId: string): void;
  rate(shareId: string, stars: number, tags: string[]): void;
  reset(): void;
}
const C = createContext<Ctx | null>(null);
const now = () => new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [st, setSt] = useState<State>(seed);
  const [hydrated, setH] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setSt(JSON.parse(r)); } catch {} setH(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY, JSON.stringify(st)); }, [st, hydrated]);
  const noti = (s: State, text: string): State => ({ ...s, notis: [{ id: crypto.randomUUID(), text, at: now() }, ...s.notis] });
  const title = (s: State, id: string) => s.shares.find((x) => x.id === id)?.title ?? "";

  const v: Ctx = {
    ...st, hydrated,
    login: (u) => setSt((s) => noti({ ...s, user: u, hosts: s.hosts.some((h) => h.id === "me") ? s.hosts : [...s.hosts, { id: "me", name: u.name, manner: u.manner, trades: 0 }] }, "학교·위치 인증이 완료됐어요. 500m 인증 배지가 부여됐습니다.")),
    logout: () => setSt((s) => ({ ...s, user: null })),
    addShare: (d) => {
      const id = "u" + Date.now();
      setSt((s) => noti({ ...s, shares: [{ ...d, id, hostId: "me", joinedUnits: 1, distanceM: 0, walkMin: 0 }, ...s.shares] }, `'${d.title}' 쉐어를 등록했어요.`));
      return id;
    },
    join: (shareId, price, deposit) => setSt((s) => noti({
      ...s,
      shares: s.shares.map((x) => x.id === shareId ? { ...x, joinedUnits: x.joinedUnits + 1 } : x),
      joins: [...s.joins, { shareId, status: "deposited", price, deposit, code: "JM-" + Math.random().toString(36).slice(2, 8).toUpperCase() }],
    }, `'${title(s, shareId)}' 보증금 예치 완료. 주최자가 보관함에 넣으면 픽업할 수 있어요.`)),
    advance: (shareId) => setSt((s) => {
      const j = s.joins.find((x) => x.shareId === shareId); if (!j) return s;
      const n = nextStatus(j.status);
      return noti({ ...s, joins: s.joins.map((x) => x.shareId === shareId ? { ...x, status: n } : x) },
        n === "pickup" ? `'${title(s, shareId)}' 보관함 입고 완료! QR로 수령하세요.` : `'${title(s, shareId)}' 수령 완료. 자동 정산되고 보증금이 반환됐어요.`);
    }),
    rate: (shareId, stars, tags) => setSt((s) => {
      const hostId = s.shares.find((x) => x.id === shareId)?.hostId;
      return noti({ ...s,
        hosts: s.hosts.map((h) => h.id === hostId ? { ...h, manner: applyRating(h.manner, stars), trades: h.trades + 1 } : h),
        joins: s.joins.map((x) => x.shareId === shareId ? { ...x, rated: true } : x),
      }, `매너 평가 완료 (★${stars}${tags.length ? " · " + tags.join(", ") : ""})`);
    }),
    reset: () => setSt(seed()),
  };
  return <C.Provider value={v}>{children}</C.Provider>;
}
export function useStore() { const c = useContext(C); if (!c) throw new Error("no store"); return c; }
