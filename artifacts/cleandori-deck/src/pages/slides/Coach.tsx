export default function Coach() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-cream text-ink">
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex items-center justify-between font-mono text-[1vw] text-muted">
        <div className="flex items-center gap-[0.8vw]">
          <div className="bg-ink text-cream font-bold px-[0.8vw] py-[0.4vh] text-[1vw]">
            04
          </div>
          <span className="uppercase tracking-[0.2em] text-ink font-bold">
            Dual Coach + Safety
          </span>
        </div>
        <div className="uppercase tracking-[0.15em]">cleandori · 05 / 06</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[14vh]">
        <h1 className="font-display text-[4.4vw] leading-[1.0] tracking-tight uppercase max-w-[80vw]">
          정리 전문가 +
          <span className="block">비판단적 행동 코치.</span>
        </h1>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[40vh] bottom-[18vh] grid grid-cols-2 gap-[2vw]">
        <div className="flex flex-col">
          <div className="font-mono text-[1.05vw] uppercase tracking-[0.2em] text-accent font-bold">
            가능한 실행 장벽
          </div>
          <div className="flex flex-wrap gap-[0.8vw] mt-[1.5vh]">
            <span
              className="font-display uppercase text-[1.5vw] px-[1vw] py-[0.6vh]"
              style={{ border: "0.3vh solid var(--slide-ink)" }}
            >
              시각적 과부하
            </span>
            <span
              className="font-display uppercase text-[1.5vw] px-[1vw] py-[0.6vh]"
              style={{ border: "0.3vh solid var(--slide-ink)" }}
            >
              시작점 상실
            </span>
            <span
              className="font-display uppercase text-[1.5vw] px-[1vw] py-[0.6vh]"
              style={{ border: "0.3vh solid var(--slide-ink)" }}
            >
              결정 피로
            </span>
          </div>
          <p className="font-mono text-[1.25vw] text-ink leading-[1.55] mt-[3vh] max-w-[40vw]">
            여러 물건이 섞여 있어서 어디서부터 시작할지
            막막하게 느껴질 수 있어요. 전체를 치우지 않아도 괜찮아요.
            지금은 한 구역만 회복해볼게요.
          </p>
        </div>

        <div
          className="p-[2vw] flex flex-col"
          style={{
            background: "var(--slide-ink)",
            color: "var(--slide-cream)",
          }}
        >
          <div className="font-mono text-[1.05vw] uppercase tracking-[0.2em] font-bold" style={{ color: "var(--slide-accent)" }}>
            안전 원칙 · Safety First
          </div>
          <div className="flex flex-col gap-[1.4vh] mt-[2vh] font-mono text-[1.2vw] leading-[1.45]">
            <div className="flex gap-[0.8vw]">
              <span className="font-display text-[1.4vw]" style={{ color: "var(--slide-accent)" }}>×</span>
              <span>판단·진단하지 않습니다.</span>
            </div>
            <div className="flex gap-[0.8vw]">
              <span className="font-display text-[1.4vw]" style={{ color: "var(--slide-accent)" }}>×</span>
              <span>방을 더럽다고 부르지 않습니다.</span>
            </div>
            <div className="flex gap-[0.8vw]">
              <span className="font-display text-[1.4vw]" style={{ color: "var(--slide-accent)" }}>×</span>
              <span>전체를 치우라고 말하지 않습니다.</span>
            </div>
            <div className="flex gap-[0.8vw]">
              <span className="font-display text-[1.4vw]" style={{ color: "var(--slide-accent)" }}>×</span>
              <span>정신건강 진단명을 사용하지 않습니다.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[5vh]">
        <div
          className="w-full"
          style={{ height: "0.25vh", background: "var(--slide-ink)" }}
        />
        <div className="flex items-center justify-between mt-[1.2vh] font-mono text-[1vw]">
          <div className="text-muted">
            "가능한 실행 장벽" 표현만 사용 · 진단 언어 사용 금지
          </div>
          <div className="text-ink font-bold uppercase tracking-[0.15em]">
            tone · non-judgmental by default
          </div>
        </div>
      </div>
    </div>
  );
}
