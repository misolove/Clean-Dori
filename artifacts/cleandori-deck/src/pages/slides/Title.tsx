export default function Title() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-cream text-ink">
      <div className="absolute top-[5vh] left-[5vw] flex items-center gap-[0.8vw]">
        <div className="bg-ink text-cream font-mono font-bold px-[1vw] py-[0.6vh] text-[1.05vw] tracking-tight">
          cleandori.ai
        </div>
        <div className="font-mono text-[1vw] text-muted">/ hackathon · 2026</div>
      </div>

      <div
        className="absolute"
        style={{
          top: "8vh",
          right: "6vw",
          width: "40vw",
          height: "30vh",
          background: "var(--slide-accent)",
          border: "0.4vh solid var(--slide-ink)",
          transform: "rotate(-2deg)",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "44vh",
          right: "10vw",
          width: "22vw",
          height: "16vh",
          border: "0.4vh solid var(--slide-ink)",
          transform: "rotate(3deg)",
          background: "var(--slide-cream)",
        }}
      />
      <div
        className="absolute font-mono text-[1.3vw] font-bold text-ink"
        style={{ top: "49vh", right: "13vw", transform: "rotate(3deg)" }}
      >
        before → after
      </div>
      <div
        className="absolute font-mono text-[1.05vw] text-muted"
        style={{ top: "53vh", right: "13vw", transform: "rotate(3deg)" }}
      >
        in three minutes
      </div>

      <div className="absolute left-[5vw] bottom-[16vh] max-w-[55vw]">
        <div className="font-display text-[10vw] leading-[0.92] tracking-tight text-ink uppercase">
          CLEAN
        </div>
        <div className="flex items-baseline gap-[1.2vw] -mt-[1vh]">
          <div className="font-display text-[10vw] leading-[0.92] tracking-tight text-ink uppercase">
            DORI
          </div>
          <div
            className="font-display uppercase text-[3vw] leading-none px-[1vw] py-[0.8vh] tracking-tight"
            style={{ background: "var(--slide-ink)", color: "var(--slide-cream)" }}
          >
            클린돌이
          </div>
        </div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[5vh]">
        <div
          className="w-full"
          style={{ height: "0.25vh", background: "var(--slide-ink)" }}
        />
        <div className="flex items-end justify-between mt-[1.5vh]">
          <p className="font-mono text-[1.4vw] text-ink max-w-[55vw] leading-[1.5]">
            사진 한 장으로 정리된 미래 모습을 보고,
            <span className="block mt-[0.3vh]">3분 정리 미션을 시작하세요.</span>
          </p>
          <div className="font-mono text-[1vw] text-muted text-right">
            <div className="font-bold text-ink">AI ORGANIZING COACH</div>
            <div className="mt-[0.3vh]">PITCH · 01 / 06</div>
          </div>
        </div>
      </div>
    </div>
  );
}
