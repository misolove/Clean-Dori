export default function Architecture() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-cream text-ink">
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex items-center justify-between font-mono text-[1vw] text-muted">
        <div className="flex items-center gap-[0.8vw]">
          <div className="bg-ink text-cream font-bold px-[0.8vw] py-[0.4vh] text-[1vw]">
            05
          </div>
          <span className="uppercase tracking-[0.2em] text-ink font-bold">
            Architecture · Live AIs
          </span>
        </div>
        <div className="uppercase tracking-[0.15em]">cleandori · 06 / 07</div>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[14vh]">
        <h1 className="font-display text-[4.4vw] leading-[1.0] tracking-tight uppercase max-w-[80vw]">
          두 개의 AI,
          <span className="block">하나의 안전망.</span>
        </h1>
        <p className="font-mono text-[1.2vw] text-muted mt-[1.8vh] max-w-[62vw] leading-[1.5]">
          Claude는 사람의 마음을 읽고, OpenAI는 공간의 다음 모습을 그립니다.
          어떤 호출이 흔들려도 데모는 같은 화면으로 멈추지 않습니다.
        </p>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[42vh] bottom-[16vh] grid grid-cols-3 gap-[1.5vw]">
        <div
          className="p-[2vw] flex flex-col relative"
          style={{
            border: "0.4vh solid var(--slide-ink)",
            background: "var(--slide-cream)",
          }}
        >
          <div
            className="absolute -top-[1.6vh] -left-[0.6vw] font-display text-[1.2vw] uppercase px-[0.8vw] py-[0.3vh]"
            style={{ background: "var(--slide-accent)", color: "var(--slide-cream)" }}
          >
            Live · 01
          </div>
          <div className="font-display text-[2.2vw] leading-[1.05] uppercase mt-[1vh]">
            Claude Sonnet 4.5
          </div>
          <div className="font-mono text-[1.1vw] text-ink mt-[1.5vh] leading-[1.5]">
            방 사진을 읽고 가능한 실행 장벽, 3분 미션, 안전 안내,
            if-then 규칙을 구조화된 JSON으로 생성합니다.
          </div>
          <div className="mt-auto pt-[1.5vh] font-mono text-[0.95vw] uppercase tracking-[0.15em] text-muted">
            POST /api/claude-analysis
          </div>
        </div>

        <div
          className="p-[2vw] flex flex-col relative"
          style={{
            border: "0.4vh solid var(--slide-ink)",
            background: "var(--slide-ink)",
            color: "var(--slide-cream)",
          }}
        >
          <div
            className="absolute -top-[1.6vh] -left-[0.6vw] font-display text-[1.2vw] uppercase px-[0.8vw] py-[0.3vh]"
            style={{ background: "var(--slide-accent)", color: "var(--slide-cream)" }}
          >
            Live · 02
          </div>
          <div className="font-display text-[2.2vw] leading-[1.05] uppercase mt-[1vh]">
            OpenAI gpt-image-1
          </div>
          <div className="font-mono text-[1.1vw] mt-[1.5vh] leading-[1.5]">
            올린 사진을 그대로 받아, 같은 구도·같은 가구로 정돈된 한 장면을
            실제로 만들어 돌려줍니다.
          </div>
          <div
            className="mt-auto pt-[1.5vh] font-mono text-[0.95vw] uppercase tracking-[0.15em]"
            style={{ color: "var(--slide-accent)" }}
          >
            POST /api/openai-clean-preview
          </div>
        </div>

        <div
          className="p-[2vw] flex flex-col relative"
          style={{
            border: "0.4vh dashed var(--slide-ink)",
            background: "var(--slide-cream)",
          }}
        >
          <div
            className="absolute -top-[1.6vh] -left-[0.6vw] font-display text-[1.2vw] uppercase px-[0.8vw] py-[0.3vh]"
            style={{ background: "var(--slide-cream)", color: "var(--slide-ink)", border: "0.3vh solid var(--slide-ink)" }}
          >
            Fallback · Always
          </div>
          <div className="font-display text-[2.2vw] leading-[1.05] uppercase mt-[1vh]">
            Mock-First Demo
          </div>
          <div className="font-mono text-[1.1vw] text-ink mt-[1.5vh] leading-[1.5]">
            네트워크·키·모델 무엇이 흔들려도 같은 화면과 같은 톤으로 폴백.
            무대 위에서 데모가 멈추지 않습니다.
          </div>
          <div className="mt-auto pt-[1.5vh] font-mono text-[0.95vw] uppercase tracking-[0.15em] text-muted">
            source: "mock"
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
            두 AI는 코칭 도구이지, 진단·낙인 장치가 아닙니다.
          </div>
          <div className="text-ink font-bold uppercase tracking-[0.15em]">
            two real AIs · zero crash demo
          </div>
        </div>
      </div>
    </div>
  );
}
