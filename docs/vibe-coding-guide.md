PDF 페이지 뷰어/검색 지침서 (MVP)
목적

DB에 등록된 PDF에서 특정 페이지를 즉시 표시한다.

모바일 우선 UI와 URL 접근(웹) 을 기본으로 한다.

키워드 검색 → 해당 페이지로 이동의 단순한 흐름을 보장한다.

범위 (Scope)

포함:

PDF 특정 페이지 표시(/viewer?doc={id}&page={n} 딥링크)

키워드 검색(여러 PDF를 대상으로) → 결과 클릭 시 해당 페이지로 이동

모바일 터치/줌/페이지 넘김 기본 동작

제외:

PPTX ↔ PDF 페이지 자동 매핑 (요구상 “불가능” 판단, 미지원)

고급 협업(주석/댓글/북마크 동기화 등)

복잡한 권한/결재/워크플로우

대규모 AI/임베딩 기반 검색(필수 아님)

기능 요구사항

뷰어

특정 페이지 로드: /viewer?doc={id}&page={n}

확대/축소, 다음/이전 페이지

페이지 번호 직접 입력 이동

검색

입력: 단일 키워드 또는 간단한 구문

결과: 문서 제목 / 페이지 번호 / 짧은 스니펫

결과 클릭 시 바로 뷰어로 이동

오류 처리

잘못된 page 요청 시 가장 가까운 유효 페이지로 보정하고 안내

비기능 요구사항

대용량 대응: 전체 자료 용량이 600MB+ 여도 첫 화면 표시가 지연되지 않도록 부분 로딩 및 점진적 렌더링을 사용

모바일 최적화: 터치 제스처(핀치줌/스와이프), 뷰포트 대응

단순 배포: URL로 접속 가능(로그인/권한은 후순위)

아키텍처(최소안)

프론트엔드: 웹(React/Next 등 택일) + PDF 렌더러(예: PDF.js 또는 react-pdf 중 하나)

백엔드(BFF)

POST /api/search : 키워드로 페이지 후보 조회

GET /api/docs/{id}/meta : 문서 메타(제목, 총 페이지 수)

GET /api/docs/{id}/pages/{page} : 페이지 뷰(스트림 또는 서명 URL)

스토리지

원본 PDF(오브젝트 스토리지)

(선택) 미리 렌더링한 페이지 이미지(저사양 모바일 대비)

데이터베이스

문서 메타/페이지 텍스트 저장 (일반 RDB로 충분)

데이터 모델(최소안)
-- 문서 메타
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  file_key TEXT NOT NULL,      -- 스토리지 키
  page_count INT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 페이지별 텍스트(검색 용)
CREATE TABLE document_pages (
  doc_id TEXT REFERENCES documents(id),
  page_no INT NOT NULL,
  text TEXT,                   -- 해당 페이지에서 추출된 텍스트
  PRIMARY KEY (doc_id, page_no)
);

API 스펙(간단)
POST /api/search
  body: { q: string, topK?: number=10 }
  res:  { hits: [{ docId, page, title, snippet }] }

GET /api/docs/{id}/meta
  res: { id, title, pageCount }

GET /api/docs/{id}/pages/{page}?format=pdfjs|image
  res: 200 (바이너리 스트림 또는 서명 URL JSON)

인덱싱 플로우(최소)

PDF 업로드 시 페이지 단위 텍스트 추출

텍스트 레이어가 있으면 그대로 사용

(선택) 없는 페이지만 부분 OCR

document_pages(text) 에 저장

검색은 키워드 기반(BM25/TF-IDF 또는 DB의 Full-Text) 으로 구현

UX 가이드(최소)

검색 → 결과 리스트 → 페이지 즉시 점프 (탭/모바일에서 끊김 없이)

(선택) 뷰어에서 검색어 하이라이트 표시

(선택) 다음/이전 1페이지 프리페치로 체감 속도 개선

성능/운영 체크리스트

 원본 PDF는 Range 요청 허용(부분 다운로드)

 (선택) 페이지 이미지를 WebP 등으로 저장해 저사양 단말에 제공

 CDN 캐시로 정적/페이지 자산 가속

 오류/지연 로깅(검색 요청, 페이지 로드 시간)

제한 및 유의사항

PPTX → PDF 페이지 번호 불일치는 자동 매핑 미지원(요구사항에 따라 불가능 판단)

OCR 사용 시 처리 시간/비용 증가 가능 → 필요한 페이지에만 국소 적용 권장

단계별 수행(권장)

Viewer MVP: 딥링크 로드, 확대/축소, 이전/다음

Search MVP: 페이지 텍스트 인덱싱 → 결과 클릭 시 점프

성능 다듬기: Range/프리페치/CDN

(선택) 하이라이트, 이미지 모드 추가

---

## 구현 체크리스트 (단계별 진행)

### Phase 0: 프로젝트 초기 설정
- [ ] 0-1. 프로젝트 구조 확인 및 필요한 디렉토리 생성
- [ ] 0-2. Neon DB 연동 요청
- [ ] 0-3. Vercel Blob 연동 요청
- [ ] 0-4. 기본 타입 정의 (Document, Page 등)

### Phase 1: 데이터베이스 스키마
- [ ] 1-1. documents 테이블 생성 SQL 스크립트
- [ ] 1-2. document_pages 테이블 생성 SQL 스크립트
- [ ] 1-3. 인덱스 추가 (검색 성능용)

### Phase 2: PDF 업로드 기본 기능
- [ ] 2-1. 업로드 UI 페이지 생성 (/admin/upload)
- [ ] 2-2. Server Action: PDF를 Vercel Blob에 업로드
- [ ] 2-3. Server Action: documents 테이블에 메타데이터 저장
- [ ] 2-4. 업로드된 문서 목록 표시

### Phase 3: PDF 뷰어 구현
- [ ] 3-1. react-pdf 라이브러리 설정
- [ ] 3-2. 뷰어 페이지 생성 (/viewer)
- [ ] 3-3. URL 파라미터로 doc_id, page 받기
- [ ] 3-4. 페이지 네비게이션 (이전/다음 버튼)
- [ ] 3-5. 페이지 번호 직접 입력 기능
- [ ] 3-6. 확대/축소 기능

### Phase 4: 텍스트 추출 (OCR)
- [ ] 4-1. PDF 텍스트 추출 유틸리티 함수 작성
- [ ] 4-2. Server Action: 업로드 시 자동으로 텍스트 추출
- [ ] 4-3. document_pages 테이블에 텍스트 저장
- [ ] 4-4. 추출 진행 상태 표시 (선택)

### Phase 5: 검색 기능
- [ ] 5-1. 검색 UI 페이지 생성 (/search)
- [ ] 5-2. API Route: POST /api/search 구현
- [ ] 5-3. 키워드로 document_pages 검색 (LIKE 또는 Full-Text)
- [ ] 5-4. 검색 결과 리스트 표시 (문서명, 페이지, 스니펫)
- [ ] 5-5. 결과 클릭 시 뷰어로 이동

### Phase 6: 모바일 최적화
- [ ] 6-1. 반응형 레이아웃 적용
- [ ] 6-2. 터치 제스처 지원 (핀치줌, 스와이프)
- [ ] 6-3. 모바일에서 테스트

### Phase 7: 성능 최적화 (선택)
- [ ] 7-1. 페이지 프리페치 구현
- [ ] 7-2. 검색어 하이라이트 표시
- [ ] 7-3. 로딩 상태 개선

---

## 현재 진행 상태

**다음 단계: Phase 0-1 (프로젝트 구조 확인)**

진행 기록:
- (날짜) Phase X-X 완료: 설명
