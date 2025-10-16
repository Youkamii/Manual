"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  url: string
  initialPage?: number
}

export function PDFViewer({ url, initialPage = 1 }: PDFViewerProps) {
  const [pageNumber, setPageNumber] = useState<number>(initialPage)
  const [numPages, setNumPages] = useState<number>(0)
  const [scale, setScale] = useState<number>(1.0)
  const [loading, setLoading] = useState<boolean>(true)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
    console.log("[v0] PDF loaded successfully, total pages:", numPages)
  }

  function onDocumentLoadError(error: Error) {
    console.error("[v0] PDF load error:", error)
    setLoading(false)
  }

  function goToPrevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  function goToNextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  }

  function zoomIn() {
    setScale((prev) => Math.min(prev + 0.25, 3.0))
  }

  function zoomOut() {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
        <Button onClick={goToPrevPage} disabled={pageNumber <= 1} variant="outline" size="sm">
          <ChevronLeft className="h-4 w-4 mr-1" />
          이전
        </Button>

        <span className="text-sm font-medium min-w-[120px] text-center">
          {numPages > 0 ? `${pageNumber} / ${numPages}` : `페이지 ${pageNumber}`}
        </span>

        <Button onClick={goToNextPage} disabled={pageNumber >= numPages} variant="outline" size="sm">
          다음
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button onClick={zoomOut} disabled={scale <= 0.5} variant="outline" size="sm">
          <ZoomOut className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(scale * 100)}%</span>

        <Button onClick={zoomIn} disabled={scale >= 3.0} variant="outline" size="sm">
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center w-full overflow-auto">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">PDF 로딩 중...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-8">
              <div className="text-destructive">PDF를 불러올 수 없습니다.</div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  )
}
