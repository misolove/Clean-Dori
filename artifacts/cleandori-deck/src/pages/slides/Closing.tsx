export default function Closing() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-cream text-ink">
      <div
        className="absolute"
        style={{
          top: "10vh",
          right: "8vw",
          width: "26vw",
          height: "30vh",
          background: "var(--slide-ink)",
          transform: "rotate(2deg)",
        }}
      />
      <div
        className="absolute font-display uppercase text-cream"
        style={{ top: "18vh", right: "11vw", fontSize: "5vw", lineHeight: 0.95, transform: "rotate(2deg)" }}
      >
        3:00
      </div>
      <div
        className="absolute font-mono text-cream text-[1.1vw] uppercase tracking-[0.2em]"
        style={{ top: "31vh", right: "11vw", transform: "rotate(2deg)" }}
      >
        first three minutes
      </div>

      <div className="absolute top-[5vh] left-[5vw] flex items-center gap-[0.8vw]">
        <div className="bg-ink text-cream font-mono font-bold px-[1vw] py-[0.6vh] text-[1.05vw] tracking-tight">
          cleandori.ai
        </div>
        <div className="font-mono text-[1vw] text-muted uppercase tracking-[0.15em]">
          / closing · 06 / 06
        </div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[42vh]">
        <div className="font-mono text-[1.2vw] uppercase tracking-[0.25em] text-accent font-bold mb-[2vh]">
          What's next
        </div>
        <h1 className="font-display text-[6vw] leading-[0.96] tracking-tight uppercase max-w-[70vw]">
          판단하지 않는
          <span className="block">정리 코치.</span>
        </h1>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[10vh] grid grid-cols-3 gap-[2vw]">
        <div>
          <div className="font-mono text-[1vw] uppercase tracking-[0.15em] text-muted">
            Today · Mock
          </div>
          <div className="font-display text-[1.8vw] uppercase mt-[0.5vh] leading-[1.1]">
            엔드투엔드 데모
          </div>
          <div className="font-mono text-[1.05vw] text-ink mt-[0.6vh] leading-[1.4]">
            업로드 → 미리보기 → 3분 미션 흐름이 모두 동작합니다.
          </div>
        </div>
        <div>
          <div className="font-mono text-[1vw] uppercase tracking-[0.15em] text-muted">
            Next · Claude
          </div>
          <div className="font-display text-[1.8vw] uppercase mt-[0.5vh] leading-[1.1]">
            방 분석 + 미션 생성
          </div>
          <div className="font-mono text-[1.05vw] text-ink mt-[0.6vh] leading-[1.4]">
            현재 mock 함수 자리에 Claude를 그대로 끼웁니다.
          </div>
        </div>
        <div>
          <div className="font-mono text-[1vw] uppercase tracking-[0.15em] text-muted">
            Next · Gemini
          </div>
          <div className="font-display text-[1.8vw] uppercase mt-[0.5vh] leading-[1.1]">
            정리 후 미리보기 생성
          </div>
          <div className="font-mono text-[1.05vw] text-ink mt-[0.6vh] leading-[1.4]">
            mock 미리보기 자리에 Gemini 이미지를 흘려보냅니다.
          </div>
        </div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] bottom-[3.5vh]">
        <div
          className="w-full"
          style={{ height: "0.25vh", background: "var(--slide-ink)" }}
        />
        <div className="flex items-center justify-between mt-[1.2vh] font-mono text-[1vw]">
          <div className="text-ink font-bold uppercase tracking-[0.15em]">
            CleanDori · 클린돌이
          </div>
          <div className="text-muted">
            오늘은 시작했고, 그게 핵심이에요.
          </div>
        </div>
      </div>
    </div>
  );
}
