import { describe, it, expect } from "vitest";
import { unitPrice, depositFor, nextStatus, applyRating } from "./share-logic";
describe("share rules", () => {
  it("우유 1L 2명 반반 = 1,800원", () => expect(unitPrice(3600, 2, 1)).toBe(1800));
  it("보증금 최소 500원", () => expect(depositFor(1800)).toBe(500));
  it("보증금 20% 올림", () => expect(depositFor(6000)).toBe(1200));
  it("상태: 예치→픽업→완료", () => { expect(nextStatus("deposited")).toBe("pickup"); expect(nextStatus("pickup")).toBe("done"); expect(() => nextStatus("done")).toThrow(); });
  it("별점 5점 +1℃, 1점 -1℃", () => { expect(applyRating(36.5, 5)).toBe(37.5); expect(applyRating(36.5, 1)).toBe(35.5); expect(applyRating(36.5, 3)).toBe(36.5); });
});
