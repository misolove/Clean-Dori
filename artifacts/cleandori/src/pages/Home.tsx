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
// NOTE: Claude (room analysis + mission) and Gemini (preview image) will plug in later. DO NOT implement real API calls here.

const mockAnalyzeRoomImage = async (image: string | null, userState: string) => {
  return {
    barriers: ["시각적 과부하", "시작점 상실", "결정 피로"],
    summary: "여러 물건이 섞여 있어서 어디서부터 시작할지 막막하게 느껴질 수 있어요. 전체를 치우지 않아도 괜찮아요. 지금은 한 구역만 회복해볼게요.",
  };
};

const mockGenerateCleaningMission = async (analysis: any, userState: string) => {
  return {
    title: "바닥 통로 30cm 회복하기",
    duration: "3분",
    startingZone: "침대 앞 / 기타 옆 바닥 통로",
    reason: "정리 후 미리보기에서 가장 먼저 달라져 보이는 구역입니다.",
    steps: [
      { id: 1, text: "바닥에 있는 종이·빈 포장재처럼 명백한 것만 한곳에 모으기" },
      { id: 2, text: "박스 밖으로 나온 작은 물건 3개만 박스 안에 넣기" },
      { id: 3, text: "기타 주변 통로가 보이면 바로 멈추기" }
    ],
    avoid: [
      "박스 전부 열기",
      "추억 물건 판단하기",
      "옷 정리 시작하기",
      "방 전체를 완성하려고 하기"
    ],
    ifThenRule: "만약 바닥에 새 물건을 내려놓게 되면, 그때는 먼저 '보류 박스' 하나에만 넣는다."
  };
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

    const analysisRes = await mockAnalyzeRoomImage(demoBefore, "너무 막막해요");
    setAnalysis(analysisRes);
    const missionRes = await mockGenerateCleaningMission(analysisRes, "너무 막막해요");
    setMission(missionRes);
  };
  
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setPreviewReady(true);
          const analysisRes = await mockAnalyzeRoomImage(event.target.result as string, userState);
          setAnalysis(analysisRes);
          const missionRes = await mockGenerateCleaningMission(analysisRes, userState);
          setMission(missionRes);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

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
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary/20 shadow-md shadow-primary/5">
                        <img src={demoAfter} alt="After Preview" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-primary/20 rounded-xl pointer-events-none"></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground text-center bg-muted/50 p-3 rounded-lg leading-relaxed">
                      정리 후 미리보기는 완벽한 결과 약속이 아니라, 지금 공간에서 어수선함만 줄인 동기부여용 예시입니다.
                    </p>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block w-full">
                            <Button disabled className="w-full rounded-xl">AI로 새 애프터 생성하기</Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>준비 중</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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