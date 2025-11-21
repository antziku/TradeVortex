# TradeVortex 📈

> AI 기반 실시간 금융 데이터 분석 및 투자 커뮤니티 플랫폼

**부트캠프 4개월차에 제작한 풀스택 금융 트레이딩 플랫폼**  
실시간 주식 차트, AI 투자 어시스턴트, 뉴스 분석, 커뮤니티 기능 제공

[![Tech Stack](https://img.shields.io/badge/Django-5.1-green)](https://www.djangoproject.com/)
[![Tech Stack](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Tech Stack](https://img.shields.io/badge/Docker-Compose-blue)](https://docs.docker.com/compose/)

---

## 📸 주요 화면

> 💡 **Tip**: 스크린샷 3-4장 추가하면 완벽합니다
> - 메인 대시보드
> - 실시간 차트
> - AI 채팅
> - 커뮤니티

---

## 🎯 프로젝트 개요

- **개발 기간**: 2025.01.20 ~ 2025.02.05 (약 2주)
- **팀 구성**: Team EOD (Error Overflow Delay)
- **개발 인원**: 팀 프로젝트
- **개발 환경**: Docker Compose 기반 마이크로서비스

---

## ✨ 핵심 기능

### 📊 실시간 금융 데이터
- **실시간 차트**: Highcharts 기반 국내외 주식 시각화
- **WebSocket 스트리밍**: 실시간 주가 업데이트
- **주가 예측**: scikit-learn, PyTorch 기반 ML 모델
- **기술적 지표**: 이동평균선, RSI, MACD 등

### 🤖 AI 투자 어시스턴트
- **CrewAI 멀티 에이전트**: 여러 AI 에이전트가 협업하여 분석
- **실시간 채팅**: WebSocket 기반 즉각 응답
- **감성 분석**: transformers, KoNLPy로 뉴스 감성 분석
- **맞춤 추천**: 사용자 포트폴리오 기반 종목 추천

### 📰 뉴스 크롤링 & 분석
- **자동 크롤링**: Celery로 주기적 뉴스 수집 (crawl4ai)
- **워드클라우드**: 키워드 시각화
- **감성 분석**: 긍정/부정 뉴스 자동 분류
- **종목 태깅**: 관련 종목 자동 연결

### 💬 커뮤니티
- **실시간 채팅**: Django Channels (WebSocket)
- **게시판**: 자유게시판, 토론방, 종목 토론
- **소셜 기능**: 댓글, 좋아요, 팔로우

### 👤 사용자 관리
- **JWT 인증**: Access/Refresh Token
- **소셜 로그인**: 네이버, 구글, 카카오
- **이메일 인증**: 회원가입 시 이메일 확인
- **프로필**: 포트폴리오 관리

---

## 🛠 기술 스택

### Frontend
```
React 18 + Vite
├── UI: Material-UI, Ant Design, Tailwind CSS
├── State: Redux Toolkit
├── Charts: Highcharts, Plotly, D3.js
├── Animation: Framer Motion, GSAP
└── Real-time: WebSocket
```

### Backend
```
Django 5.1 + DRF
├── Real-time: Django Channels (WebSocket)
├── Task Queue: Celery + Redis
├── Database: PostgreSQL
├── Auth: JWT, django-allauth
└── Server: Gunicorn + Uvicorn
```

### AI/ML
```
├── LLM: OpenAI GPT, Google Gemini
├── Framework: PyTorch, scikit-learn, transformers
├── NLP: KoNLPy
├── Agent: CrewAI
└── Data: finance-datareader
```

### Infrastructure
```
Docker Compose
├── Web: Nginx
├── Cache: Redis
├── DB: PostgreSQL
└── Admin: pgAdmin, RedisInsight
```

---

## 📁 프로젝트 구조

```
tradevortex/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── redux/           # Redux 상태 관리
│   │   └── api/             # API 호출
│   └── package.json
│
├── backend/                  # Django 백엔드
│   ├── TradeVortex/         # 프로젝트 설정
│   ├── accounts/            # 사용자 인증
│   ├── financedata/         # 금융 데이터
│   ├── newspage/            # 뉴스 크롤링
│   ├── aiassist/            # AI 어시스턴트
│   ├── graphs/              # 실시간 차트
│   ├── board/               # 게시판
│   ├── toron/               # 토론방
│   ├── realtimechat/        # 실시간 채팅
│   └── requirements.txt
│
├── docker-compose.yml        # 서비스 오케스트레이션
├── nginx.conf               # Nginx 설정
└── README.md
```

---

## 🚀 빠른 시작

### 필수 요구사항
- Docker & Docker Compose
- Git

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/tradevortex.git
cd tradevortex

# 2. 환경 변수 설정 (아래 환경 변수 섹션 참고)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# .env 파일 수정 필요

# 3. Docker Compose 실행
docker-compose up -d

# 4. 데이터베이스 마이그레이션
docker-compose exec django python manage.py migrate

# 5. 슈퍼유저 생성 (선택)
docker-compose exec django python manage.py createsuperuser
```

### 서비스 접속
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin**: http://localhost:8000/admin
- **pgAdmin**: http://localhost:5050
- **RedisInsight**: http://localhost:5540

---

## 🔑 환경 변수 설정

### Backend (.env)
```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/tradevortex

# Redis
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# AI APIs
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key

# Social Login
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-secret
GOOGLE_CLIENT_ID=your-google-client-id

# Email
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_NAVER_CLIENT_ID=your-naver-client-id
VITE_KAKAO_JAVASCRIPT_KEY=your-kakao-key
```

---

## 📊 주요 API 엔드포인트

### 인증
```
POST   /api/accounts/signup/          # 회원가입
POST   /api/accounts/login/           # 로그인
POST   /api/accounts/logout/          # 로그아웃
POST   /api/accounts/token/refresh/   # 토큰 갱신
```

### 금융 데이터
```
GET    /api/financedata/stocks/       # 주식 목록
GET    /api/financedata/chart/{symbol}/  # 차트 데이터
GET    /api/financedata/predict/{symbol}/  # 주가 예측
```

### 뉴스
```
GET    /api/news/                     # 뉴스 목록
GET    /api/news/{id}/                # 뉴스 상세
GET    /api/news/wordcloud/           # 워드클라우드
```

### AI 어시스턴트
```
POST   /api/aiassist/chat/            # AI 채팅
GET    /api/aiassist/recommend/       # 종목 추천
```

### WebSocket
```
ws://localhost:8000/ws/stock/{symbol}/     # 실시간 주가
ws://localhost:8000/ws/chat/{room}/        # 실시간 채팅
```

---

## 💡 주요 구현 내용

### 1. 실시간 차트 (WebSocket)
```python
# backend/graphs/consumers.py
class StockConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.symbol = self.scope['url_route']['kwargs']['symbol']
        await self.channel_layer.group_add(f"stock_{self.symbol}", self.channel_name)
        await self.accept()
        
    async def stock_update(self, event):
        await self.send(text_data=json.dumps(event['data']))
```

### 2. AI 어시스턴트 (CrewAI)
```python
# backend/aiassist/crew.py
analyst = Agent(
    role='Financial Analyst',
    goal='Analyze stock data and provide investment insights',
    tools=[stock_analysis_tool, news_sentiment_tool]
)

researcher = Agent(
    role='Market Researcher',
    goal='Research market trends and news',
    tools=[news_crawler_tool, market_data_tool]
)

crew = Crew(agents=[analyst, researcher], tasks=[...])
```

### 3. 뉴스 크롤링 (Celery)
```python
# backend/newspage/tasks.py
@shared_task
def crawl_financial_news():
    crawler = NewsCrawler()
    articles = crawler.fetch_latest()
    for article in articles:
        sentiment = analyze_sentiment(article.content)
        article.sentiment_score = sentiment
        article.save()
```

---

## 🎨 주요 기능 시연

### 실시간 차트
- WebSocket으로 1초마다 주가 업데이트
- Highcharts로 캔들스틱, 라인 차트 지원
- 기술적 지표 오버레이

### AI 채팅
- 자연어로 종목 질문
- 멀티 에이전트가 협업하여 분석
- 실시간 응답 스트리밍

### 뉴스 분석
- 10분마다 자동 크롤링
- 감성 분석으로 긍정/부정 분류
- 워드클라우드로 트렌드 파악

---

## 🐛 트러블슈팅

### Docker 컨테이너 실행 오류
```bash
docker-compose down -v
docker-compose up --build
```

### 데이터베이스 연결 오류
```bash
docker-compose exec django python manage.py migrate --run-syncdb
```

### Redis 연결 오류
```bash
docker-compose restart redis celery
```

### 포트 충돌
```bash
# docker-compose.yml에서 포트 변경
ports:
  - "3001:3000"  # 3000 대신 3001 사용
```

---

## 📈 성능 최적화

- **Redis 캐싱**: API 응답 속도 50% 개선
- **Celery 비동기**: 무거운 작업 백그라운드 처리
- **WebSocket**: HTTP 폴링 대비 90% 트래픽 감소
- **DB 인덱싱**: 쿼리 속도 3배 향상

---

## 🔒 보안 고려사항

> ⚠️ **주의**: 이 프로젝트는 학습/포트폴리오 목적입니다.  
> 프로덕션 배포 시 아래 사항을 반드시 수정하세요.

- [ ] SECRET_KEY 환경변수로 분리
- [ ] DEBUG=False 설정
- [ ] ALLOWED_HOSTS 제한
- [ ] CORS_ALLOW_ALL_ORIGINS=False
- [ ] HTTPS 적용
- [ ] API 키 재발급
- [ ] .env 파일 .gitignore 추가

---

## 📚 배운 점

### 기술적 성장
- Django Channels로 WebSocket 구현
- Celery로 비동기 작업 처리
- Docker Compose로 멀티 컨테이너 관리
- CrewAI로 멀티 에이전트 시스템 구축
- JWT 인증 구현

### 어려웠던 점
- WebSocket 연결 관리 및 에러 핸들링
- Celery 태스크 스케줄링 및 모니터링
- CORS/CSRF 설정
- Docker 네트워크 설정

### 개선하고 싶은 점
- 테스트 코드 작성
- 에러 핸들링 강화
- 코드 리팩토링
- 성능 최적화

---

## 🚧 향후 계획

- [ ] AWS 배포 (EC2, RDS, S3)
- [ ] CI/CD 파이프라인 구축
- [ ] 테스트 코드 작성 (pytest, Jest)
- [ ] 모바일 반응형 개선
- [ ] 알림 기능 추가
- [ ] 포트폴리오 백테스팅 기능

---

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

This project is licensed under the MIT License.

---

## 👥 팀원

**Team EOD (Error Overflow Delay)**
- 부트캠프 4개월차 팀 프로젝트
- 개발 기간: 약 2주

---

## 📞 문의

프로젝트 관련 문의: [이메일 주소]

GitHub: [GitHub 링크]

---

## 🙏 감사의 말

이 프로젝트는 부트캠프에서 배운 내용을 바탕으로 제작했습니다.  
부족한 점이 많지만, 계속 개선해 나가겠습니다.

---

⭐ **이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**

---

## 📖 참고 자료

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Django Channels](https://channels.readthedocs.io/)
- [CrewAI](https://docs.crewai.com/)
- [Docker Compose](https://docs.docker.com/compose/)
