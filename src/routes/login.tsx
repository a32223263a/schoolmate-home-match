import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Mail, ShieldCheck } from "lucide-react";
import { AppShell, btn, input, card } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { IntroVideo } from "@/components/app/IntroVideo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "학교 인증 · 자취메이트" }, { name: "description", content: "단국대 이메일과 반경 500m 위치 인증으로 안전하게 시작하세요." }, { property: "og:title", content: "학교 인증 · 자취메이트" }, { property: "og:description", content: "단국대 이메일과 반경 500m 위치 인증으로 안전하게 시작하세요." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Login,
});

function Login() {
  const { login } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [err, setErr] = useState("");
  const [locating, setLocating] = useState(false);
  const valid = /^[^@\s]+@dankook\.ac\.kr$/.test(email);

  return (
    <AppShell requireAuth={false}>
      <div className="lg:grid lg:min-h-[calc(100vh-6rem)] lg:grid-cols-2 lg:items-center lg:gap-12">
      <section className="lg:rounded-3xl lg:bg-accent lg:p-12">
      <div className="pb-6 pt-10 lg:p-0">
        <p className="text-sm font-semibold text-primary">자취메이트</p>
        <h1 className="mt-2 text-2xl font-bold leading-snug lg:text-4xl">대용량과 배달비는 반으로,<br />초근접 비대면 쉐어 라이프</h1>
      </div>
      <ul className="mt-8 hidden space-y-3 text-accent-foreground lg:block">
        <li className="flex items-center gap-2"><Mail className="size-5" />단국대 학교 이메일 인증</li>
        <li className="flex items-center gap-2"><MapPin className="size-5" />정·후문 반경 500m 생활권 인증</li>
        <li className="flex items-center gap-2"><ShieldCheck className="size-5" />보증금 예치 · 비대면 QR 픽업</li>
      </ul>
      <div className="mb-8 lg:mb-0 lg:mt-10 lg:max-w-md">
        <IntroVideo onStart={() => { if (step === 1) setTimeout(() => document.getElementById("email")?.focus(), 50); }} />
      </div>
      </section>
      <section className="lg:mx-auto lg:w-full lg:max-w-md">
      <ol className="mb-6 flex gap-2">{[1, 2, 3].map((n) => <li key={n} className={"h-1.5 flex-1 rounded-full " + (step >= n ? "bg-primary" : "bg-secondary")} />)}</ol>

      {step === 1 && (
        <div className="space-y-3">
          <label className="text-sm font-semibold" htmlFor="email"><Mail className="mr-1 inline size-4" />학교 이메일</label>
          <input id="email" className={input} placeholder="학번@dankook.ac.kr" value={email} onChange={(e) => setEmail(e.target.value.trim())} />
          {email && !valid && <p className="text-sm text-destructive">@dankook.ac.kr 이메일만 가능해요.</p>}
          <button className={btn} disabled={!valid} onClick={() => setStep(2)}>인증코드 받기</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3">
          <div className={card + " bg-accent text-sm text-accent-foreground"}>테스트용 인증코드: <b className="tracking-widest">{sent}</b></div>
          <label className="text-sm font-semibold" htmlFor="code">인증코드 6자리</label>
          <input id="code" inputMode="numeric" className={input} value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }} />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button className={btn} onClick={() => (code === sent ? setStep(3) : setErr("코드가 일치하지 않아요."))}>확인</button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <div className={card + " text-center"}>
            <MapPin className="mx-auto size-10 text-primary" />
            <p className="mt-2 font-semibold">단국대 정·후문 반경 500m</p>
            <p className="text-sm text-muted-foreground">현재 위치가 생활권 안에 있는지 확인해요.</p>
          </div>
          <button className={btn} disabled={locating} onClick={() => {
            setLocating(true);
            setTimeout(() => {
              login({ email, name: email.split("@")[0] + "님", gps: true, manner: 36.5 });
              nav({ to: "/" });
            }, 900);
          }}>{locating ? "위치 확인 중..." : <><ShieldCheck className="mr-2 size-5" />위치 인증하고 시작하기</>}</button>
        </div>
      )}
      </section>
      </div>
    </AppShell>
  );
}
