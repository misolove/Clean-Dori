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
          / closing · 07 / 07
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
          <div className="font-mono text-[1vw] uppercase tracking-[0.15em]" style={{ color: "var(--slide-accent)" }}>
            Today · Shipped
          </div>
          <div className="font-display text-[1.8vw] uppercase mt-[0.5vh] leading-[1.1]">
            두 AI 라이브 통합
          </div>
          <div className="font-mono text-[1.05vw] text-ink mt-[0.6vh] leading-[1.4]">
            Claude 분석 + OpenAI 미리보기 + 비판단 코칭이 한 흐름에서 동작합니다.
          </div>
        </div>
        <div>
          <div className="font-mono text-[1vw] uppercase tracking-[0.15em] text-muted">
            Next · 2 weeks
          </div>
          <div className="font-display text-[1.8vw] uppercase mt-[0.5vh] leading-[1.1]">
            모바일 + 미션 히스토리
          </div>
          <div className="font-mono text-[1.05vw] text-ink mt-[0.6vh] leading-[1.4]">
            카메라 바로 찍기, 회복한 구역의 누적 기록을 부드럽게 보여줍니다.
          </div>
        </div>
        <div>
          <div className="font-mono text-[1vw] uppercase tracking-[0.15em] text-muted">
            Next · Scale
          </div>
          <div className="font-display text-[1.8vw] uppercase mt-[0.5vh] leading-[1.1]">
            동행자 모드 + 음성
          </div>
          <div className="font-mono text-[1.05vw] text-ink mt-[0.6vh] leading-[1.4]">
            보호자·친구가 함께 시작하는 짧은 음성 동행, 안전 신호 알림.
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
