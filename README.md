# 클린돌이 CleanDori 🧹

> **사진 한 장이면 충분합니다.** 어지러운 방 사진을 올리면, 정리된 미래 모습과 **딱 3분짜리 정리 미션**을 알려드려요.

<p align="center">
  <img src="attached_assets/readme/screenshot-home.jpg" alt="CleanDori 홈 화면" width="720" />
</p>

---

## 🌱 CleanDori는 어떤 서비스인가요?

집이 어지러워서 막막할 때, 보통 우리는 이런 생각을 합니다.

- "어디서부터 손대야 하지…"
- "오늘은 도저히 에너지가 없어"
- "이걸 버려, 말아…?"

**CleanDori는 판단하지 않습니다.** 대신 *지금 당장 할 수 있는 가장 작은 한 걸음*만 알려줘요.

| 단계 | 사용자가 하는 일 | 클린돌이가 하는 일 |
| --- | --- | --- |
| 1️⃣ | 방 사진 한 장 올리기 | 사진 속 "정리의 장벽"을 분석 |
| 2️⃣ | 오늘 내 컨디션 고르기 (5가지) | 컨디션에 딱 맞는 1~10분 미션 생성 |
| 3️⃣ | 미션 따라 움직이기 | 정리된 "미래 모습" 미리 보여주기 |

> 💚 **핵심 철학** — *"정리의 문제는 정보 부족이 아니라 시작 장벽입니다."*

---

## 🖼️ 이렇게 바뀝니다

<table>
  <tr>
    <th align="center">Before · 지금 내 방</th>
    <th align="center">After · 3분 뒤 모습</th>
  </tr>
  <tr>
    <td><img src="attached_assets/readme/demo-before.png" alt="정리 전" width="380" /></td>
    <td><img src="attached_assets/readme/demo-after.png" alt="정리 후" width="380" /></td>
  </tr>
</table>

---

## 🎤 발표 슬라이드

해커톤 발표용 7장짜리 슬라이드 덱도 함께 들어 있어요.

<p align="center">
  <img src="attached_assets/readme/screenshot-deck.jpg" alt="CleanDori 발표 슬라이드" width="720" />
</p>

---

## 📂 프로젝트는 어떻게 구성되어 있나요?

이 저장소는 **하나의 큰 폴더 안에 여러 개의 작은 앱**이 들어 있는 구조(monorepo)예요.

```
Clean-Dori/
├── artifacts/
│   ├── cleandori/         🧹 메인 웹 앱 (사용자가 보는 화면)
│   ├── cleandori-deck/    🎤 발표용 슬라이드 덱
│   ├── api-server/        🔌 백엔드 API 서버
│   └── mockup-sandbox/    🎨 디자인 시안 작업용
├── lib/                   📦 여러 앱이 같이 쓰는 공용 코드
└── attached_assets/       🖼️ 이미지·스크린샷 모음
```

| 앱 | 무엇을 하나요? | 어디서 볼 수 있나요? |
| --- | --- | --- |
| **cleandori** | 사진 업로드 → AI 분석 → 미션 안내까지 전체 사용자 흐름 | 홈 화면 (`/`) |
| **cleandori-deck** | 해커톤 발표용 7장 슬라이드 | `/cleandori-deck` |
| **api-server** | 백엔드 API (현재는 데모 모드 위주) | `/api` |
| **mockup-sandbox** | 디자이너용 컴포넌트 미리보기 | 내부용 |

---

## 🛠️ 어떤 기술로 만들었나요?

- **프론트엔드**: React 19 + Vite + TypeScript + Tailwind CSS
- **UI 컴포넌트**: shadcn/ui (Radix UI 기반)
- **애니메이션**: Framer Motion
- **백엔드**: Node.js 24 + Express 5
- **데이터베이스**: PostgreSQL + Drizzle ORM
- **AI 연동**: Anthropic Claude (방 분석·미션) + OpenAI (After 이미지)
- **패키지 관리**: pnpm workspace (모노레포)

---

## 🚀 직접 실행해보고 싶다면

> 이 프로젝트는 [Replit](https://replit.com) 환경에 맞춰져 있어요. Replit에서 열면 위 앱들이 자동으로 실행됩니다.

로컬에서 돌려본다면:

```bash
# 1. 패키지 설치
pnpm install

# 2. (선택) DB 연결 정보 설정
export DATABASE_URL="postgresql://..."

# 3. 메인 웹 앱 실행
pnpm --filter @workspace/cleandori run dev

# 4. 슬라이드 덱 실행
pnpm --filter @workspace/cleandori-deck run dev

# 5. API 서버 실행
pnpm --filter @workspace/api-server run dev
```

전체 타입 검사:

```bash
pnpm run typecheck
```

---

## 💡 데모 모드로 바로 체험하기

API 키 없이도 어떻게 동작하는지 보고 싶다면, 메인 화면에서 **`Presentation Demo Mode`** 버튼을 눌러보세요. 미리 준비된 사진과 미션으로 전체 흐름을 둘러볼 수 있습니다.

---

## 📝 라이선스 & 크레딧

- Made with 💚 for the **Replit Hackathon 2026**
- 데모 사진 출처: Unsplash (Brett Jordan, Jason Leung)
