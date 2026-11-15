import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Play, X, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import introVideo from "@/assets/jachimate_intro.mp4.asset.json";
import introPoster from "@/assets/jachimate_intro_poster.jpg.asset.json";
import introThumb from "@/assets/jachimate_intro_thumb.jpg.asset.json";

const DURATION = "1:17";

/**
 * Intro video entry point: a compact thumbnail card that opens a vertical (9:16) player.
 * Full-screen on phones, centered phone-sized player on desktop. `onStart` runs from the
 * end-of-video / footer call to action so the viewer can continue straight into sign-up.
 */
export function IntroVideo({ onStart }: { onStart?: () => void }) {
  const [open, setOpen] = useState(false);
  const starting = useRef(false);
  const start = () => { starting.current = true; setOpen(false); };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-4 rounded-2xl border bg-card p-3 text-left shadow-video transition hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[.99] lg:p-4"
        >
          <span className="relative aspect-[8/9] w-20 shrink-0 overflow-hidden rounded-xl bg-secondary lg:w-24">
            <img src={introThumb.url} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
            <span className="absolute inset-0 bg-video-scrim" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground motion-safe:animate-play-ring lg:size-9">
                <Play className="ml-0.5 size-4 fill-current" />
              </span>
            </span>
            <span className="absolute bottom-1 right-1 rounded-md bg-dark-point/70 px-1 text-[10px] font-semibold tabular-nums text-media-foreground">{DURATION}</span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-primary">소개 영상</span>
            <span className="mt-0.5 block font-bold leading-snug lg:text-lg">1분 만에 보는 자취메이트</span>
            <span className="mt-1 block text-sm text-muted-foreground">대용량 소분부터 무인 보관함 QR 픽업까지</span>
          </span>
          <span className="hidden size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground transition group-hover:bg-primary group-hover:text-primary-foreground sm:grid">
            <Play className="ml-0.5 size-4 fill-current" />
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-dark-point/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 sm:p-6"
          onPointerDownOutside={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => { if (starting.current) { starting.current = false; e.preventDefault(); onStart?.(); } }}
        >
          <Dialog.Title className="sr-only">자취메이트 소개 영상</Dialog.Title>
          <Dialog.Description className="sr-only">자취생을 위한 비대면 생필품 소분 가이드, 약 1분 17초</Dialog.Description>
          <Player onStart={start} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Player({ onStart }: { onStart: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);

  const replay = () => { const v = ref.current; if (!v) return; setEnded(false); v.currentTime = 0; void v.play(); };
  const retry = () => { const v = ref.current; if (!v) return; setFailed(false); setLoading(true); v.load(); void v.play().catch(() => {}); };

  return (
    <div className="relative flex h-full w-full flex-col sm:h-auto sm:w-auto">
      <div className="relative flex-1 overflow-hidden bg-dark-point sm:aspect-[9/16] sm:h-[min(82vh,780px)] sm:flex-none sm:rounded-3xl sm:shadow-2xl">
        <video
          ref={ref}
          src={introVideo.url}
          poster={introPoster.url}
          className="size-full object-contain sm:object-cover"
          controls
          autoPlay
          playsInline
          preload="metadata"
          onCanPlay={() => setLoading(false)}
          onPlaying={() => { setLoading(false); setEnded(false); }}
          onWaiting={() => setLoading(true)}
          onEnded={() => setEnded(true)}
          onError={() => { setLoading(false); setFailed(true); }}
        />

        {loading && !failed && !ended && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <Loader2 className="size-10 animate-spin text-media-foreground/90" aria-label="불러오는 중" />
          </div>
        )}

        {(ended || failed) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-dark-point/90 px-8 text-center text-media-foreground backdrop-blur-md animate-in fade-in-0">
            {failed ? (
              <>
                <p className="font-semibold">영상을 불러오지 못했어요.</p>
                <p className="text-sm text-media-foreground/75">네트워크 상태를 확인하고 다시 시도해 주세요.</p>
                <button type="button" onClick={retry} className="inline-flex h-11 items-center gap-2 rounded-xl bg-media-foreground/15 px-5 font-semibold transition hover:bg-media-foreground/25">
                  <RotateCcw className="size-4" />다시 시도
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-primary">자취메이트</p>
                <p className="text-xl font-bold leading-snug">딱 필요한 만큼만,<br />만나지 않고 나눠요</p>
                <button type="button" onClick={onStart} className="mt-2 inline-flex h-12 w-full max-w-60 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition active:scale-[.98]">
                  학교 인증하고 시작하기<ArrowRight className="size-4" />
                </button>
                <button type="button" onClick={replay} className="inline-flex items-center gap-1.5 text-sm font-medium text-media-foreground/80 transition hover:text-media-foreground">
                  <RotateCcw className="size-4" />다시 보기
                </button>
              </>
            )}
          </div>
        )}

        <Dialog.Close
          aria-label="영상 닫기"
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-dark-point/60 text-media-foreground backdrop-blur transition hover:bg-dark-point/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ marginTop: "env(safe-area-inset-top)" }}
        >
          <X className="size-5" />
        </Dialog.Close>
      </div>

      <div className="hidden items-center justify-between gap-4 pt-4 text-media-foreground sm:flex">
        <div>
          <p className="font-semibold">자취생을 위한 비대면 생필품 소분 가이드</p>
          <p className="text-sm text-media-foreground/70">자취메이트 소개 · {DURATION}</p>
        </div>
        <button type="button" onClick={onStart} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition active:scale-[.98]">
          시작하기<ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
