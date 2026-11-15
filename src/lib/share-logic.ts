export type Category = "food" | "living" | "delivery";
export type JoinStatus = "deposited" | "pickup" | "done";

export const CATEGORY_LABEL: Record<Category, string> = { food: "식재료", living: "생필품", delivery: "배달비 쉐어" };
export const STATUS_LABEL: Record<JoinStatus, string> = { deposited: "예치 완료", pickup: "픽업 대기", done: "거래 완료" };
export const PICKUP_ZONES = ["정문 GS편의점 택배함", "후문 CU 무인 보관함", "기숙사 1층 무인 보관함", "죽전역 방면 스마트 락커"];

export interface Share {
  id: string; title: string; category: Category; totalQty: number; unitQty: number;
  totalPrice: number; pickupZone: string; distanceM: number; walkMin: number;
  hostId: string; joinedUnits: number; deadline: string; description: string;
}
export interface Host { id: string; name: string; manner: number; trades: number }

/** 1인(1소분) 가격: 총액을 소분 개수로 나눠 10원 단위 올림 */
export function unitPrice(totalPrice: number, totalQty: number, unitQty: number): number {
  const parts = Math.max(1, Math.floor(totalQty / unitQty));
  return Math.ceil(totalPrice / parts / 10) * 10;
}
export function totalUnits(s: Pick<Share, "totalQty" | "unitQty">) { return Math.max(1, Math.floor(s.totalQty / s.unitQty)); }
export function remainingUnits(s: Share) { return Math.max(0, totalUnits(s) - s.joinedUnits); }
/** 노쇼 방지 보증금: 1인 가격의 20%, 최소 500원, 100원 단위 올림 */
export function depositFor(price: number) { return Math.max(500, Math.ceil((price * 0.2) / 100) * 100); }

const NEXT: Record<JoinStatus, JoinStatus | null> = { deposited: "pickup", pickup: "done", done: null };
export function nextStatus(s: JoinStatus): JoinStatus {
  const n = NEXT[s]; if (!n) throw new Error("이미 거래 완료"); return n;
}
/** 별점 1~5 → 매너온도 변화: 3점 0, 1점당 ±0.5℃, 범위 0~99 */
export function applyRating(manner: number, stars: number) {
  const v = manner + (stars - 3) * 0.5;
  return Math.round(Math.min(99, Math.max(0, v)) * 10) / 10;
}
export const won = (n: number) => n.toLocaleString("ko-KR") + "원";
