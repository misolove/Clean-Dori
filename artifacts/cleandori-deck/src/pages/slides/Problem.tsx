export default function Problem() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-cream text-ink">
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex items-center justify-between font-mono text-[1vw] text-muted">
        <div className="flex items-center gap-[0.8vw]">
          <div className="bg-ink text-cream font-bold px-[0.8vw] py-[0.4vh] text-[1vw]">
            01
          </div>
          <span className="uppercase tracking-[0.2em] text-ink font-bold">
            The Problem
          </span>
        </div>
        <div className="uppercase tracking-[0.15em]">cleandori · 02 / 06</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[18vh]">
        <div className="font-mono text-[1.1vw] text-accent uppercase tracking-[0.25em] mb-[2vh] font-bold">
          정리가 어려운 진짜 이유
        </div>
        <h1 className="font-display text-[6.4vw] leading-[1.02] tracking-tight uppercase max-w-[80vw]">
          정보 부족이
          <span className="block">아니라,</span>
          <span
            className="inline-block px-[1.2vw] py-[0.4vh] mt-[1vh]"
            style={{ background: "var(--slide-accent)", color: "var(--slide-cream)" }}
          >
            시작 장벽.
          </span>
        </h1>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[5vh]">
        <div
          className="w-full"
          style={{ height: "0.25vh", background: "var(--slide-ink)" }}
        />
        <div className="grid grid-cols-3 gap-[2vw] mt-[2vh]">
          <div>
            <div className="font-mono text-[1vw] text-muted uppercase tracking-[0.15em]">
              Barrier 01
            </div>
            <div className="font-display text-[2vw] leading-[1.1] mt-[0.6vh] uppercase">
              시각적 과부하
            </div>
            <div className="font-mono text-[1.2vw] text-ink mt-[0.8vh] leading-[1.4]">
              물건이 너무 많아 보여서 시야가 멈춥니다.
            </div>
          </div>
          <div>
            <div className="font-mono text-[1vw] text-muted uppercase tracking-[0.15em]">
              Barrier 02
            </div>
            <div className="font-display text-[2vw] leading-[1.1] mt-[0.6vh] uppercase">
              시작점 상실
            </div>
            <div className="font-mono text-[1.2vw] text-ink mt-[0.8vh] leading-[1.4]">
              어디서부터 손을 대야 할지 알 수 없습니다.
            </div>
          </div>
          <div>
            <div className="font-mono text-[1vw] text-muted uppercase tracking-[0.15em]">
              Barrier 03
            </div>
            <div className="font-display text-[2vw] leading-[1.1] mt-[0.6vh] uppercase">
              결정 피로
            </div>
            <div className="font-mono text-[1.2vw] text-ink mt-[0.8vh] leading-[1.4]">
              버릴지 말지를 매번 판단해야 합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
