-- PDF 검색 서비스 기본 테이블 생성
-- Phase 1: DB 스키마 설정

-- documents 테이블: PDF 문서 메타데이터
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  blob_url TEXT NOT NULL,
  file_size BIGINT,
  total_pages INTEGER NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- document_pages 테이블: 페이지별 텍스트 데이터
CREATE TABLE IF NOT EXISTS document_pages (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  extracted_text TEXT,
  ocr_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(document_id, page_number)
);

-- 검색 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_document_pages_document_id ON document_pages(document_id);
CREATE INDEX IF NOT EXISTS idx_document_pages_text_search ON document_pages USING gin(to_tsvector('english', extracted_text));

-- 코멘트 추가
COMMENT ON TABLE documents IS 'PDF 문서 메타데이터 저장';
COMMENT ON TABLE document_pages IS '페이지별 OCR 추출 텍스트 저장';
COMMENT ON COLUMN document_pages.extracted_text IS 'OCR로 추출된 텍스트, Full-Text Search 대상';
