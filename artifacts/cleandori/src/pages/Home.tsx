import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, ChevronRight, Play, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import demoBefore from "@assets/brett-jordan-bSoV4nbrkzA-unsplash_1778236944319.jpg";
import demoAfter from "@assets/a_tidy_softly_lit_interior_room_scene_viewed_stra_1778236956570.png";

// Mock Architecture for API Swaps
// NOTE: Claude (room analysis + mission) and OpenAI (preview image) will plug in later. DO NOT implement real API calls here.

const mockAnalyzeRoomImage = async (image: string | null, userState: string) => {
  return {
    barriers: ["시각적 과부하", "시작점 상실", "결정 피로"],
    summary: "여러 물건이 섞여 있어서 어디서부터 시작할지 막막하게 느껴질 수 있어요. 전체를 치우지 않아도 괜찮아요. 지금은 한 구역만 회복해볼게요.",
  };
};

const MISSION_VARIANTS: Record<string, any> = {
  "너무 막막해요": {
    title: "딱 한 가지만 — 1분 회복",
    duration: "1분",
    startingZone: "눈에 가장 먼저 들어오는 평면 한 곳",
    reason: "전체를 보지 않고, 시야 한 칸만 회복하면 다음이 보입니다.",
    steps: [
      { id: 1, text: "타이머 1분 맞추기" },
      { id: 2, text: "눈에 가장 거슬리는 물건 딱 한 개만 제자리로 옮기기" },
      { id: 3, text: "1분이 끝나면 바로 멈추고 잘 했다고 말하기" },
    ],
    avoid: ["오늘 안에 더 하려고 하기", "다른 구역까지 둘러보기", "버릴지 말지 판단하기"],
    ifThenRule: "만약 1분 안에 끝났다면, 한 번 더 하지 말고 오늘은 여기서 멈춘다.",
  },
  "에너지가 낮아요": {
    title: "바닥 통로 30cm 회복하기 — 3분 미션",
    duration: "3분",
    startingZone: "발이 자주 닿는 바닥 한 줄",
    reason: "에너지가 낮은 날에는 가장 자주 지나는 길만 살짝 넓혀도 충분합니다.",
    steps: [
      { id: 1, text: "바닥에 있는 종이·빈 포장재처럼 명백한 것만 한곳에 모으기" },
      { id: 2, text: "통로 위 작은 물건 3개만 가까운 곳으로 옮기기" },
      { id: 3, text: "발 한 걸음만큼 길이 트이면 바로 멈추기" },
    ],
    avoid: ["박스 열어보기", "옷 정리 시작하기", "방 전체를 완성하려고 하기"],
    ifThenRule: "만약 3분 안에 다 끝났다면, 더 하지 않고 물 한 잔 마시며 쉰다.",
  },
  "조금은 가능해요": {
    title: "한 평면 비우기 — 5분 회복",
    duration: "5분",
    startingZone: "책상·식탁·협탁 중 가장 자주 쓰는 평면 하나",
    reason: "평면 한 곳이 트이면 그 위의 다음 행동이 자연스럽게 시작됩니다.",
    steps: [
      { id: 1, text: "선택한 평면 위 물건을 모두 한쪽으로 모으기" },
      { id: 2, text: "그중 '여기에 두는 게 자연스러운 것'만 다시 올려두기" },
      { id: 3, text: "나머지는 바닥의 임시 자리에 그대로 두고 평면을 한 번 닦기" },
      { id: 4, text: "5분이 지나면 마무리하고 사진 한 장 남기기" },
    ],
    avoid: ["서랍·박스 안까지 손대기", "버릴지 말지 결정하기", "다른 평면까지 손대기"],
    ifThenRule: "만약 도중에 의미를 따지게 되면, 그 물건은 일단 옆에 두고 다음 물건으로 넘어간다.",
  },
  "오늘은 해볼 만해요": {
    title: "10분 루틴 — 한 구역 회복",
    duration: "10분",
    startingZone: "오늘 가장 자주 머무는 구역 하나 (예: 침대 옆 또는 책상)",
    reason: "한 구역만 끝까지 다듬어 두면, 다음 날의 시작점이 됩니다.",
    steps: [
      { id: 1, text: "타이머 10분 맞추기" },
      { id: 2, text: "구역 안 바닥의 명백한 것 먼저 치우기 (3분)" },
      { id: 3, text: "평면 위 물건을 같은 종류끼리 모으기 (3분)" },
      { id: 4, text: "모은 것 중 자주 쓰는 것만 다시 자리 잡기 (3분)" },
      { id: 5, text: "타이머가 울리면 바로 멈추고 사진 한 장 남기기" },
    ],
    avoid: ["10분을 넘겨서 계속하기", "옆 구역까지 확장하기", "오늘 안에 끝내려고 하기"],
    ifThenRule: "만약 10분이 지나도 미련이 남으면, 내일 같은 시간 같은 구역에서 한 번 더 한다.",
  },
  "버릴지 결정이 어려워요": {
    title: "보류 박스 만들기 — 결정 미루기",
    duration: "5분",
    startingZone: "빈 박스나 종이가방 하나를 둘 수 있는 자리",
    reason: "버릴지 말지 지금 정하지 않아도 됩니다. 결정을 미룰 자리만 만들면 충분합니다.",
    steps: [
      { id: 1, text: "빈 박스·가방·바구니 한 개를 '보류'라고 정해 두기" },
      { id: 2, text: "지금 자리에 두기 애매한 물건만 그 안에 담기" },
      { id: 3, text: "박스가 절반 차거나 5분이 지나면 멈추기" },
      { id: 4, text: "박스 위에 오늘 날짜 적어 두기" },
    ],
    avoid: ["박스 안에서 다시 골라내기", "버릴지 말지 지금 결정하기", "여러 개의 보류 박스 만들기"],
    ifThenRule: "만약 한 달 동안 박스를 한 번도 다시 열지 않았다면, 그때 한 번에 정리한다.",
  },
};

const mockGenerateCleaningMission = async (analysis: any, userState: string) => {
  return MISSION_VARIANTS[userState] ?? MISSION_VARIANTS["에너지가 낮아요"];
};

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [userState, setUserState] = useState<string>("너무 막막해요");
  const [previewReady, setPreviewReady] = useState(false);
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [mission, setMission] = useState<any>(null);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [analysisSource, setAnalysisSource] = useState<"mock" | "claude">("mock");
  const [claudeLoading, setClaudeLoading] = useState(false);
  const [claudeError, setClaudeError] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [afterSource, setAfterSource] = useState<"mock" | "openai">("mock");
  const [openaiLoading, setOpenAILoading] = useState(false);
  const [openaiAttempts, setOpenAIAttempts] = useState(0);
  const [openaiError, setOpenAIError] = useState<string | null>(null);

  const OPENAI_MAX_ATTEMPTS = 3;
  const OPENAI_PROMPT = `You are editing the uploaded photo of a real personal space. Output ONE edited image (not the original) that shows the same space after a realistic 10-minute tidy-up.

Preserve from the input photo:
- same camera angle, framing, and perspective
- same room or area, same walls, floor, and furniture
- same lighting, color tone, and time of day
- the same major personal objects already visible (do not remove what the person owns)

Change only these things:
- reduce visible clutter on the floor, bed, desk, or other surfaces
- group or stack loose items into neat piles, baskets, or boxes
- fold or align visible fabrics, clothes, or bedding
- clear obvious walking paths and usable surfaces
- keep the result realistic and lived-in, not staged

Do NOT:
- redesign the space, change the layout, or add new furniture
- remove the person's belongings; only reorganize them
- make it look like a luxury showroom or magazine photo
- create a collage, before/after split, grid, or multiple panels
- add any text, labels, watermarks, arrows, or UI overlays
- output the input image unchanged — you MUST make visible tidying changes

Return exactly one edited photographic image of the same space, post-tidy.`;

  const handleOpenAIPreview = async () => {
    if (!uploadedImage) return;
    if (openaiLoading) return;
    if (openaiAttempts >= OPENAI_MAX_ATTEMPTS) return;
    setOpenAILoading(true);
    setOpenAIError(null);
    setOpenAIAttempts((n) => n + 1);
    const fallbackToMock = (msg: string) => {
      setAfterImage(null);
      setAfterSource("mock");
      setOpenAIError(msg);
    };
    try {
      const imageBase64 = await toDataUri(uploadedImage);
      const res = await fetch(
        `${import.meta.env.BASE_URL}api/openai-clean-preview`.replace(/\/{2,}/g, "/"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, prompt: OPENAI_PROMPT }),
        },
      );
      if (!res.ok) {
        fallbackToMock("AI 생성에 실패해 기존 미리보기로 되돌렸어요.");
        return;
      }
      const data = await res.json();
      if (
        data.source === "openai" &&
        typeof data.imageBase64 === "string" &&
        data.imageBase64.startsWith("data:image/")
      ) {
        setAfterImage(data.imageBase64);
        setAfterSource("openai");
      } else {
        fallbackToMock("AI 생성에 실패해 기존 미리보기로 되돌렸어요.");
      }
    } catch {
      fallbackToMock("요청에 실패해 기존 미리보기로 되돌렸어요.");
    } finally {
      setOpenAILoading(false);
    }
  };

  const BARRIER_LABELS: Record<string, string> = {
    visual_overload: "시각적 과부하",
    no_clear_start: "시작점 상실",
    decision_fatigue: "결정 피로",
    low_energy: "낮은 에너지",
    shame_avoidance: "회피하고 싶은 마음",
    attachment_difficulty: "물건 보내기 어려움",
    perfectionism: "완벽주의",
    maintenance_failure: "유지의 어려움",
    shared_space_ambiguity: "공유 공간 모호함",
    safety_risk: "안전 우려",
  };

  const toDataUri = async (src: string): Promise<string> => {
    if (src.startsWith("data:")) return src;
    const res = await fetch(src);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(blob);
    });
  };

  const handleClaudeAnalysis = async () => {
    if (!uploadedImage) return;
    if (claudeLoading) return;
    setClaudeLoading(true);
    setClaudeError(null);
    try {
      const imageBase64 = await toDataUri(uploadedImage);
      const res = await fetch(
        `${import.meta.env.BASE_URL}api/claude-analysis`.replace(/\/{2,}/g, "/"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, userState }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const barriersArr = Array.isArray(data.possible_barriers) ? data.possible_barriers : [];
      const top = barriersArr[0] ?? null;
      const barrierLabels: string[] = barriersArr
        .slice(0, 4)
        .map((b: any) => BARRIER_LABELS[b?.type] ?? b?.type ?? "");

      setAnalysis({
        barriers: barrierLabels.filter(Boolean),
        summary: data.gentle_summary ?? "",
        topBarrierLabel: top ? BARRIER_LABELS[top.type] ?? top.type : null,
        topBarrierReason: top?.reason ?? null,
        selfCheckQuestion: data.self_check_questions?.[0] ?? null,
        safetyMessage:
          data.safety && data.safety.risk_level !== "normal" ? data.safety.message : null,
        safetyRiskLevel: data.safety?.risk_level ?? "normal",
        disclaimer: data.disclaimer ?? null,
      });

      const rawThree = data.missions?.["3_min"];
      const threeMin: string[] = Array.isArray(rawThree)
        ? rawThree.filter((s: unknown): s is string => typeof s === "string")
        : [];
      const avoidArr: string[] = Array.isArray(data.avoid)
        ? data.avoid.filter((s: unknown): s is string => typeof s === "string")
        : [];
      const cuesArr: string[] = Array.isArray(data.visible_cues)
        ? data.visible_cues.filter((s: unknown): s is string => typeof s === "string")
        : [];
      if (threeMin.length > 0) {
        setMission({
          title: "AI가 제안한 3분 미션",
          duration: "3분",
          startingZone: cuesArr[0] ?? "AI가 제안한 시작 구역",
          reason:
            (typeof data.preview_image_role === "string" && data.preview_image_role) ||
            "정리 후 미리보기에서 가장 먼저 달라져 보이는 구역입니다.",
          steps: threeMin.map((text, i) => ({ id: i + 1, text })),
          avoid: avoidArr,
          ifThenRule: typeof data.if_then_rule === "string" ? data.if_then_rule : "",
        });
        setCheckedSteps([]);
      }

      setAnalysisSource(data.source === "claude" ? "claude" : "mock");
      if (data.source !== "claude") {
        setClaudeError("Claude 응답을 사용할 수 없어 mock 분석으로 대체했어요.");
      }
    } catch (err) {
      setClaudeError("분석 요청에 실패해 mock 분석으로 되돌렸어요.");
      try {
        const fallbackAnalysis = await mockAnalyzeRoomImage(uploadedImage, userState);
        setAnalysis(fallbackAnalysis);
        const fallbackMission = await mockGenerateCleaningMission(fallbackAnalysis, userState);
        setMission(fallbackMission);
        setCheckedSteps([]);
        setAnalysisSource("mock");
      } catch {
        // keep existing state if even mock fails
      }
    } finally {
      setClaudeLoading(false);
    }
  };
  
  const handleStartDemo = async () => {
    setHasStarted(true);
    setUploadedImage(demoBefore);
    setUserState("너무 막막해요");
    setPreviewReady(true);
    setCheckedSteps([]);
    setAnalysisSource("mock");
    setClaudeError(null);
    setAfterImage(null);
    setAfterSource("mock");
    setOpenAIAttempts(0);
    setOpenAIError(null);

    const analysisRes = await mockAnalyzeRoomImage(demoBefore, "너무 막막해요");
    setAnalysis(analysisRes);
    const missionRes = await mockGenerateCleaningMission(analysisRes, "너무 막막해요");
    setMission(missionRes);
  };
  
  const resizeImageFile = (file: File, maxDim = 1600, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (!dataUrl) {
          reject(new Error("Failed to read image"));
          return;
        }
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          const scale = Math.min(1, maxDim / Math.max(width, height));
          const targetW = Math.round(width * scale);
          const targetH = Math.round(height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, targetW, targetH);
          try {
            const out = canvas.toDataURL("image/jpeg", quality);
            resolve(out);
          } catch {
            resolve(dataUrl);
          }
        };
        img.onerror = () => reject(new Error("Failed to decode image"));
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImageFile(file);
      setUploadedImage(resized);
      setPreviewReady(true);
      setAfterImage(null);
      setAfterSource("mock");
      setOpenAIAttempts(0);
      setOpenAIError(null);
      setAnalysisSource("mock");
      setClaudeError(null);
      setCheckedSteps([]);
      const analysisRes = await mockAnalyzeRoomImage(resized, userState);
      setAnalysis(analysisRes);
      const missionRes = await mockGenerateCleaningMission(analysisRes, userState);
      setMission(missionRes);
    } catch (err) {
      setClaudeError(err instanceof Error ? err.message : "이미지를 불러오지 못했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  // Re-run mock mission whenever the user changes their state radio.
  // Only applies to mock-sourced analyses — Claude-generated missions stay
  // as-is to avoid silently overwriting a live AI result.
  useEffect(() => {
    if (!analysis) return;
    if (analysisSource !== "mock") return;
    let cancelled = false;
    (async () => {
      const next = await mockGenerateCleaningMission(analysis, userState);
      if (!cancelled) {
        setMission(next);
        setCheckedSteps([]);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  const handleToggleStep = (id: number) => {
    setCheckedSteps(prev => 
      prev.includes(id) ? prev.filter(stepId => stepId !== id) : [...prev, id]
    );
  };

  if (!hasStarted) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full flex flex-col items-center text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">클린돌이 CleanDori</h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">사진 한 장으로 정리된 미래 모습을 보고, 3분 정리 미션을 시작하세요.</p>
          </div>
          
          <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 max-w-lg w-full">
            <p className="text-lg font-medium text-foreground">정리의 문제는 정보 부족이 아니라 시작 장벽입니다.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button size="lg" onClick={() => setHasStarted(true)} className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <UploadCloud className="mr-2 h-6 w-6" />
              사진 올리고 시작하기
            </Button>
            <Button size="lg" variant="secondary" onClick={handleStartDemo} className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform">
              <Play className="mr-2 h-6 w-6" />
              Presentation Demo Mode
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-8">CleanDori는 당신의 공간을 판단하지 않습니다. 그냥 첫 3분을 도와드립니다.</p>
        </motion.div>
      </div>
    );
  }

  const progressPercent = mission ? Math.round((checkedSteps.length / mission.steps.length) * 100) : 0;
  const isComplete = progressPercent === 100;

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-primary cursor-pointer" onClick={() => setHasStarted(false)}>클린돌이 CleanDori</div>
          <Button variant="outline" size="sm" onClick={handleStartDemo}>
            <Play className="mr-2 h-4 w-4" /> Demo Mode
          </Button>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="border-primary/10 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg">사진 업로드</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUploadImage} />
                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">사진을 선택하거나 끌어다 놓으세요</p>
                      <p className="text-sm text-muted-foreground mt-1">민감한 문서, 신분증, 비밀번호, 개인정보가 보이는 사진은 올리지 마세요.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                      <img src={uploadedImage} alt="Uploaded room" className="object-cover w-full h-full" />
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setUploadedImage(null)}>다른 사진 올리기</Button>
                  </div>
                )}
                
                {!uploadedImage && (
                  <Button variant="secondary" className="w-full" onClick={handleStartDemo}>Use Demo Image</Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">지금 상태가 어때요?</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={userState} onValueChange={setUserState} className="space-y-3">
                  {[
                    "너무 막막해요 — 딱 하나만 알려줘요",
                    "에너지가 낮아요 — 3분만 가능해요",
                    "조금은 가능해요 — 5분 정도 가능해요",
                    "오늘은 해볼 만해요 — 10분 루틴 가능해요",
                    "버릴지 결정이 어려워요 — 보류 박스 방식이 필요해요"
                  ].map((state, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <RadioGroupItem value={state.split(" —")[0]} id={`state-${i}`} />
                      <Label htmlFor={`state-${i}`} className="font-normal cursor-pointer leading-tight">{state}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Column: Preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <Card className="border-primary/10 shadow-sm rounded-2xl h-full flex flex-col">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg">변화 미리보기</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-grow flex flex-col space-y-6">
                {previewReady && uploadedImage ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-medium text-muted-foreground">현재 모습</span>
                      </div>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
                        <img src={uploadedImage} alt="Before" className="object-cover w-full h-full" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-sm font-medium text-primary">정리 후 미리보기</span>
                      </div>
                      {(() => {
                        const isDemo = uploadedImage === demoBefore;
                        const previewSrc = afterImage ?? (isDemo ? demoAfter : uploadedImage);
                        const showHint = !afterImage && !isDemo && !openaiLoading;
                        const showBadge = !!afterImage || isDemo;
                        return (
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary/20 shadow-md shadow-primary/5">
                            <img
                              src={previewSrc}
                              alt="After Preview"
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-primary/20 rounded-xl pointer-events-none"></div>
                            {showBadge && (
                              <Badge
                                variant="outline"
                                className={`absolute top-2 right-2 text-[10px] uppercase tracking-wider bg-white/90 ${
                                  afterSource === "openai"
                                    ? "border-primary/40 text-primary"
                                    : "border-muted-foreground/30 text-muted-foreground"
                                }`}
                              >
                                {afterSource === "openai" ? "OpenAI" : "Mock"}
                              </Badge>
                            )}
                            {showHint && (
                              <div className="absolute inset-0 bg-background/75 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                <p className="text-xs text-foreground/85 text-center px-5 leading-relaxed max-w-[260px]">
                                  {openaiError
                                    ? `${openaiError} 아래 버튼으로 다시 시도해 보세요.`
                                    : "아래 ‘AI로 새 애프터 생성하기’ 버튼을 누르면 이 사진의 정리 후 미리보기를 만들어요."}
                                </p>
                              </div>
                            )}
                            {openaiLoading && (
                              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                <div className="flex flex-col items-center gap-2 px-4 text-center">
                                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                  <p className="text-xs text-foreground/80 leading-relaxed">
                                    정리 후 모습을 만드는 중이에요...
                                    <br />
                                    약 30~60초 걸릴 수 있어요.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    
                    <p className="text-sm text-muted-foreground text-center bg-muted/50 p-3 rounded-lg leading-relaxed">
                      정리 후 미리보기는 완벽한 결과 약속이 아니라, 지금 공간에서 어수선함만 줄인 동기부여용 예시입니다.
                    </p>
                    
                    <Button
                      onClick={handleOpenAIPreview}
                      disabled={
                        !uploadedImage || openaiLoading || openaiAttempts >= OPENAI_MAX_ATTEMPTS
                      }
                      className="w-full rounded-xl"
                      variant={afterSource === "openai" ? "secondary" : "default"}
                    >
                      {openaiLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          AI로 새 애프터 생성하기
                        </>
                      )}
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      세션당 최대 {OPENAI_MAX_ATTEMPTS}회 · 사용 {openaiAttempts}/{OPENAI_MAX_ATTEMPTS}
                    </p>
                    {openaiError && (
                      <p className="text-xs text-muted-foreground text-center">{openaiError}</p>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <Play className="h-8 w-8 opacity-20" />
                    </div>
                    <p>사진을 올리면 마법이 시작됩니다</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Mission */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            {analysis && (
              <Card className="border-primary/10 shadow-sm rounded-2xl bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">정리 전문가 + 비판단적 행동 코치</CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase tracking-wider ${
                        analysisSource === "claude"
                          ? "border-primary/40 text-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {analysisSource === "claude" ? "Claude" : "Mock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.safetyMessage && (
                    <div className="flex gap-2 items-start bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-foreground">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>{analysis.safetyMessage}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {analysis.barriers.map((b: string) => (
                      <Badge key={b} variant="secondary" className="bg-white/60 hover:bg-white text-secondary-foreground border-primary/10">
                        {b}
                      </Badge>
                    ))}
                  </div>
                  {analysis.topBarrierReason && (
                    <div className="bg-white/60 rounded-lg p-3 border border-primary/10 space-y-1">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                        가장 가능성 높은 실행 장벽{analysis.topBarrierLabel ? ` · ${analysis.topBarrierLabel}` : ""}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {analysis.topBarrierReason}
                      </p>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-foreground/80 font-medium">
                    "{analysis.summary}"
                  </p>
                  {analysis.selfCheckQuestion && (
                    <div className="bg-secondary/60 rounded-lg p-3 border border-border text-sm">
                      <span className="font-semibold text-primary mr-1">자기 체크:</span>
                      {analysis.selfCheckQuestion}
                    </div>
                  )}

                  <Button
                    onClick={handleClaudeAnalysis}
                    disabled={!uploadedImage || claudeLoading}
                    className="w-full rounded-xl"
                    variant={analysisSource === "claude" ? "secondary" : "default"}
                  >
                    {claudeLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {analysisSource === "claude" ? "다시 분석하기" : "Claude로 실행 장벽 분석하기"}
                      </>
                    )}
                  </Button>
                  {claudeError && (
                    <p className="text-xs text-muted-foreground text-center">{claudeError}</p>
                  )}
                  {analysis.disclaimer && (
                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed pt-1">
                      {analysis.disclaimer}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {mission && (
              <Card className="border-primary/20 shadow-md rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/10">
                  <motion.div 
                    className="h-full bg-primary" 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progressPercent}%` }} 
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <CardHeader className="pb-4 pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-semibold border-none">
                      {mission.duration} 미션
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground">{progressPercent}% 완료</span>
                  </div>
                  <CardTitle className="text-2xl font-bold">{mission.title}</CardTitle>
                  <CardDescription className="text-base text-foreground mt-2">
                    <span className="font-semibold">구역:</span> {mission.startingZone}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">{mission.reason}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {mission.steps.map((step: any) => (
                      <div 
                        key={step.id} 
                        className={`flex items-start space-x-3 p-4 rounded-xl border transition-all ${
                          checkedSteps.includes(step.id) 
                            ? "bg-primary/5 border-primary/20 opacity-60" 
                            : "bg-card border-border hover:border-primary/30 shadow-sm"
                        }`}
                      >
                        <Checkbox 
                          id={`step-${step.id}`} 
                          checked={checkedSteps.includes(step.id)}
                          onCheckedChange={() => handleToggleStep(step.id)}
                          className="mt-0.5 h-5 w-5 rounded-md"
                        />
                        <Label 
                          htmlFor={`step-${step.id}`} 
                          className={`font-medium cursor-pointer leading-snug ${checkedSteps.includes(step.id) ? "line-through text-muted-foreground" : ""}`}
                        >
                          {step.text}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {isComplete && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        className="bg-primary/10 text-primary-foreground rounded-xl p-5 border border-primary/20"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                          <p className="text-foreground font-medium leading-relaxed">
                            좋아요. 통로 하나를 회복했어요. 완벽하지 않아도 괜찮아요. 오늘은 시작했고, 그게 핵심이에요.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/10">
                    <h4 className="text-sm font-bold text-destructive mb-2">지금은 하지 마세요</h4>
                    <ul className="text-sm space-y-1.5 text-foreground/80">
                      {mission.avoid.map((item: string, i: number) => (
                        <li key={i} className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-destructive/40 mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-xl p-4 text-sm font-medium border border-border">
                    <span className="text-primary font-bold mr-1">Tip:</span> 
                    {mission.ifThenRule}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}