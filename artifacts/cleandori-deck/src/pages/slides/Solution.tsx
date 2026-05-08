export default function Solution() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-cream text-ink">
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex items-center justify-between font-mono text-[1vw] text-muted">
        <div className="flex items-center gap-[0.8vw]">
          <div className="bg-ink text-cream font-bold px-[0.8vw] py-[0.4vh] text-[1vw]">
            02
          </div>
          <span className="uppercase tracking-[0.2em] text-ink font-bold">
            The Solution
          </span>
        </div>
        <div className="uppercase tracking-[0.15em]">cleandori · 03 / 07</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[15vh]">
        <h1 className="font-display text-[5vw] leading-[1.0] tracking-tight uppercase max-w-[70vw]">
          첫 3분만
          <span
            className="inline-block px-[1vw] mt-[0.6vh]"
            style={{ background: "var(--slide-ink)", color: "var(--slide-cream)" }}
          >
            도와드립니다.
          </span>
        </h1>
        <p className="font-mono text-[1.3vw] text-muted mt-[2.5vh] max-w-[60vw] leading-[1.5]">
          판단하지 않습니다. 진단하지 않습니다. 사진과 자기응답으로
          정리를 어렵게 만드는 실행 장벽을 추정하고, 단 한 구역만 회복합니다.
        </p>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[10vh] grid grid-cols-3 gap-[1.5vw]">
        <div
          className="p-[2vw] relative"
          style={{
            border: "0.35vh solid var(--slide-ink)",
            background: "var(--slide-cream)",
          }}
        >
          <div
            className="absolute -top-[1.6vh] -left-[0.6vw] font-display text-[1.4vw] uppercase px-[0.8vw] py-[0.3vh]"
            style={{ background: "var(--slide-accent)", color: "var(--slide-cream)" }}
          >
            Step 01
          </div>
          <div className="font-display text-[2.4vw] leading-[1.05] uppercase mt-[1vh]">
            사진 업로드
          </div>
          <div className="font-mono text-[1.2vw] text-ink mt-[1.5vh] leading-[1.5]">
            한 장이면 충분합니다.
            방을 진단하지 않고 공간 단서만 읽습니다.
          </div>
        </div>

        <div
          className="p-[2vw] relative"
          style={{
            border: "0.35vh solid var(--slide-ink)",
            background: "var(--slide-cream)",
          }}
        >
          <div
            className="absolute -top-[1.6vh] -left-[0.6vw] font-display text-[1.4vw] uppercase px-[0.8vw] py-[0.3vh]"
            style={{ background: "var(--slide-accent)", color: "var(--slide-cream)" }}
          >
            Step 02
          </div>
          <div className="font-display text-[2.4vw] leading-[1.05] uppercase mt-[1vh]">
            정리 후 미리보기
          </div>
          <div className="font-mono text-[1.2vw] text-ink mt-[1.5vh] leading-[1.5]">
            완벽한 인테리어가 아니라,
            어수선함만 줄인 동기부여용 한 장면.
          </div>
        </div>

        <div
          className="p-[2vw] relative"
          style={{
            border: "0.35vh solid var(--slide-ink)",
            background: "var(--slide-ink)",
            color: "var(--slide-cream)",
          }}
        >
          <div
            className="absolute -top-[1.6vh] -left-[0.6vw] font-display text-[1.4vw] uppercase px-[0.8vw] py-[0.3vh]"
            style={{ background: "var(--slide-accent)", color: "var(--slide-cream)" }}
          >
            Step 03
          </div>
          <div className="font-display text-[2.4vw] leading-[1.05] uppercase mt-[1vh]">
            3분 미션
          </div>
          <div className="font-mono text-[1.2vw] mt-[1.5vh] leading-[1.5]">
            단 한 구역, 세 단계.
            오늘 시작했다는 사실만 남기면 됩니다.
          </div>
        </div>
      </div>

      <div
        className="absolute left-[5vw] right-[5vw] bottom-[5vh]"
        style={{ height: "0.25vh", background: "var(--slide-ink)" }}
      />
    </div>
  );
}
