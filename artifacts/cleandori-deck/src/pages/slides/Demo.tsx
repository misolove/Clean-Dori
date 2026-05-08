import beforeImg from "@assets/brett-jordan-bSoV4nbrkzA-unsplash_1778236944319.jpg";
import afterImg from "@assets/a_tidy_softly_lit_interior_room_scene_viewed_stra_1778236956570.png";

export default function Demo() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-cream text-ink">
      <div className="absolute top-[5vh] left-[5vw] right-[5vw] flex items-center justify-between font-mono text-[1vw] text-muted">
        <div className="flex items-center gap-[0.8vw]">
          <div className="bg-ink text-cream font-bold px-[0.8vw] py-[0.4vh] text-[1vw]">
            03
          </div>
          <span className="uppercase tracking-[0.2em] text-ink font-bold">
            Live Demo
          </span>
        </div>
        <div className="uppercase tracking-[0.15em]">cleandori · 04 / 07</div>
      </div>

      <div className="absolute top-[12vh] left-[5vw] right-[5vw]">
        <h1 className="font-display text-[3.6vw] leading-[1.0] tracking-tight uppercase">
          같은 공간, 다른 시작점.
        </h1>
        <p className="font-mono text-[1.2vw] text-muted mt-[1.2vh] max-w-[55vw] leading-[1.5]">
          왼쪽은 사용자가 올린 사진. 오른쪽은 어수선함만 줄인 미리보기.
          이 한 장면이 첫 3분의 동기가 됩니다.
        </p>
      </div>

      <div className="absolute left-[5vw] right-[5vw] top-[32vh] bottom-[10vh] grid grid-cols-2 gap-[1.5vw]">
        <div className="relative" style={{ border: "0.4vh solid var(--slide-ink)" }}>
          <img
            src={beforeImg}
            crossOrigin="anonymous"
            alt="현재 모습"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute top-[1.5vh] left-[1vw] font-display uppercase text-[1.6vw] px-[0.8vw] py-[0.3vh]"
            style={{ background: "var(--slide-ink)", color: "var(--slide-cream)" }}
          >
            현재 모습
          </div>
          <div
            className="absolute bottom-[1.5vh] right-[1vw] font-mono text-[1vw] px-[0.6vw] py-[0.3vh]"
            style={{ background: "var(--slide-cream)", color: "var(--slide-ink)" }}
          >
            BEFORE
          </div>
        </div>

        <div className="relative" style={{ border: "0.4vh solid var(--slide-ink)" }}>
          <img
            src={afterImg}
            crossOrigin="anonymous"
            alt="정리 후 미리보기"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute top-[1.5vh] left-[1vw] font-display uppercase text-[1.6vw] px-[0.8vw] py-[0.3vh]"
            style={{ background: "var(--slide-accent)", color: "var(--slide-cream)" }}
          >
            정리 후 미리보기
          </div>
          <div
            className="absolute bottom-[1.5vh] right-[1vw] font-mono text-[1vw] px-[0.6vw] py-[0.3vh]"
            style={{ background: "var(--slide-cream)", color: "var(--slide-ink)" }}
          >
            AFTER
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
            완벽한 인테리어가 아닙니다. 첫 행동을 위한 한 장면입니다.
          </div>
          <div className="text-ink font-bold uppercase tracking-[0.15em]">
            live: openai gpt-image-1 · safe fallback: mock
          </div>
        </div>
      </div>
    </div>
  );
}
