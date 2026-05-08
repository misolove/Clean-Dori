/**
 * Mock Architecture for API Swaps
 * 
 * NOTE: Claude (room analysis + mission) and Gemini (preview image) will plug in later. 
 * DO NOT implement real API calls here. Return mock data synchronously or via Promise.resolve.
 */

export const analyzeRoomImage = async (image: string, userState: string) => {
  return Promise.resolve({
    barriers: ["시각적 과부하", "시작점 상실", "결정 피로"],
    summary: "여러 물건이 섞여 있어서 어디서부터 시작할지 막막하게 느껴질 수 있어요. 전체를 치우지 않아도 괜찮아요. 지금은 한 구역만 회복해볼게요."
  });
};

export const generateCleaningMission = async (analysis: any, userState: string) => {
  return Promise.resolve({
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
  });
};

export const generateCleanPreviewPrompt = async (analysis: any, userState: string) => {
  return Promise.resolve("A clean, organized room that still feels lived in.");
};

export const generateCleanPreviewImage = async (image: string, prompt: string) => {
  // In a real implementation this would call an API, for now it just returns a mock image path
  // Since we are mocking, we will just use the pre-generated static asset
  return Promise.resolve("/assets/demo-after.jpg");
};

export const compareAfterPhoto = async (beforeImage: string, previewImage: string, afterImage: string) => {
  return Promise.resolve({
    success: true,
    message: "Great job completing your mission!"
  });
};